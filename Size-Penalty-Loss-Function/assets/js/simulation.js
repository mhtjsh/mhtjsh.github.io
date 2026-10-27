/**
 * assets/js/simulation.js
 * Logic for Figure 1: The Dice Blindspot Simulation
 */

// Shared constants (can be moved to a shared math file if needed, but keeping self-contained for now)
const GT_LARGE = 800;
const GT_SMALL = 50;
const MAX_EPOCH = 150;

let simEpoch = 0;
let simPlaying = false;
let simRaf;
let lastSimT = 0;

let predA_L = 200, predA_S = 10;
let predB_L = 200, predB_S = 10;

let histEpochs = [], histA_S = [], histB_S = [];
let simChart;

function initSimulation() {
    const ctxSimChart = document.getElementById('sim-chart').getContext('2d');
    simChart = new Chart(ctxSimChart, {
        type: 'line',
        data: {
            labels: histEpochs,
            datasets: [
                {
                    label: 'Model A (Dice) - Small Lesion',
                    data: histA_S,
                    borderColor: '#1f77b4',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.1
                },
                {
                    label: 'Model B (SPL) - Small Lesion',
                    data: histB_S,
                    borderColor: '#d62728',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.1
                },
                {
                    label: 'Ground Truth (50)',
                    data: Array(MAX_EPOCH).fill(GT_SMALL),
                    borderColor: '#2ca02c',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { position: 'top', labels: { font: { family: 'Inter, sans-serif', size: 12 } } },
                tooltip: { enabled: false }
            },
            scales: {
                x: { title: { display: true, text: 'Epoch', font: { family: 'Inter, sans-serif' } }, min: 0, max: MAX_EPOCH },
                y: { title: { display: true, text: 'Vp (Voxels)', font: { family: 'Inter, sans-serif' } }, min: 0, max: 80 }
            }
        }
    });

    // Intersection Observer to pause/play based on visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!simPlaying && simEpoch < MAX_EPOCH) {
                    toggleSim(); // auto-play when scrolled into view
                }
            } else {
                if (simPlaying) {
                    toggleSim(); // pause when scrolled out
                }
            }
        });
    }, { threshold: 0.2 });

    observer.observe(document.getElementById('fig1'));
}

function drawBrainCanvas(canvasId, pL, pS, isSpl) {
    const cvs = document.getElementById(canvasId);
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const w = cvs.width;
    const h = cvs.height;

    ctx.clearRect(0, 0, w, h);

    const cxL = w * 0.65, cyL = h * 0.6;
    const cxS = w * 0.35, cyS = h * 0.4;

    const scale = 1.2;
    const rGtL = Math.sqrt(GT_LARGE) * scale;
    const rGtS = Math.sqrt(GT_SMALL) * scale;
    const rpL = Math.sqrt(pL) * scale;
    const rpS = Math.sqrt(pS) * scale;

    // GT Outline
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#2ca02c';
    ctx.beginPath(); ctx.arc(cxL, cyL, rGtL, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cxS, cyS, rGtS, 0, Math.PI * 2); ctx.stroke();

    // Predictions
    ctx.fillStyle = isSpl ? 'rgba(214, 39, 40, 0.4)' : 'rgba(31, 119, 180, 0.4)';
    ctx.beginPath(); ctx.arc(cxL, cyL, rpL, 0, Math.PI * 2); ctx.fill();
    
    ctx.fillStyle = isSpl ? 'rgba(214, 39, 40, 0.7)' : 'rgba(31, 119, 180, 0.7)';
    ctx.beginPath(); ctx.arc(cxS, cyS, rpS, 0, Math.PI * 2); ctx.fill();

    // Text
    const isDark = document.documentElement.dataset.theme === 'dark';
    const textColor = isDark ? '#e0e0e0' : '#1a1a1a';
    
    ctx.font = `12px "SFMono-Regular", Consolas, monospace`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';

    ctx.fillText(`Vp=${Math.round(pL)}`, cxL, cyL + rGtL + 20);
    ctx.fillStyle = '#2ca02c';
    ctx.fillText(`Vg=${GT_LARGE}`, cxL, cyL - rGtL - 10);
    
    ctx.fillStyle = textColor;
    ctx.fillText(`Vp=${Math.round(pS)}`, cxS, cyS + rpS + 15);
    ctx.fillStyle = '#2ca02c';
    ctx.fillText(`Vg=${GT_SMALL}`, cxS, cyS - rGtS - 10);
}

function computeDice(pL, pS) {
    const intL = Math.min(pL, GT_LARGE);
    const intS = Math.min(pS, GT_SMALL);
    return (2 * (intL + intS)) / ((pL + pS) + (GT_LARGE + GT_SMALL));
}

function W(Vg, tau) { return Math.exp(-Vg / tau); }

function updateSimLoop(ts) {
    if (!simPlaying) return;
    if (ts - lastSimT > 50) {
        lastSimT = ts;
        if (simEpoch < MAX_EPOCH) {
            simEpoch++;
            
            const lr = 0.08;
            predA_L = Math.min(GT_LARGE, predA_L + GT_LARGE * lr * (1 - predA_L/GT_LARGE));
            predA_S = Math.min(GT_SMALL, predA_S + GT_SMALL * (lr * 0.05) * (1 - predA_S/GT_SMALL));
            
            predB_L = Math.min(GT_LARGE, predB_L + GT_LARGE * lr * (1 - predB_L/GT_LARGE));
            let splGrad = (simEpoch > 20) ? W(GT_SMALL, 600) * 0.5 : 0;
            predB_S = Math.min(GT_SMALL, predB_S + GT_SMALL * (lr * 0.05 + splGrad) * (1 - predB_S/GT_SMALL));

            document.getElementById('sim-epoch-val').innerText = simEpoch;
            document.getElementById('dice-a-val').innerText = computeDice(predA_L, predA_S).toFixed(3);
            document.getElementById('dice-b-val').innerText = computeDice(predB_L, predB_S).toFixed(3);

            drawBrainCanvas('cvs-model-a', predA_L, predA_S, false);
            drawBrainCanvas('cvs-model-b', predB_L, predB_S, true);

            histEpochs.push(simEpoch);
            histA_S.push(predA_S);
            histB_S.push(predB_S);
            
            simChart.data.labels = histEpochs;
            simChart.data.datasets[0].data = histA_S;
            simChart.data.datasets[1].data = histB_S;
            simChart.update();
        } else {
            toggleSim();
        }
    }
    simRaf = requestAnimationFrame(updateSimLoop);
}

window.toggleSim = function() {
    simPlaying = !simPlaying;
    const btn = document.getElementById('btn-sim-play');
    if (simPlaying) {
        if (simEpoch >= MAX_EPOCH) resetSim();
        btn.innerText = '⏸ Pause Simulation';
        simRaf = requestAnimationFrame(updateSimLoop);
    } else {
        btn.innerText = '▶ Play Simulation';
        cancelAnimationFrame(simRaf);
    }
}

window.resetSim = function() {
    simEpoch = 0;
    predA_L = 200; predA_S = 10;
    predB_L = 200; predB_S = 10;
    histEpochs = []; histA_S = []; histB_S = [];
    
    if (simChart) {
        simChart.data.labels = histEpochs;
        simChart.data.datasets[0].data = histA_S;
        simChart.data.datasets[1].data = histB_S;
        simChart.update();
    }

    document.getElementById('sim-epoch-val').innerText = '0';
    document.getElementById('dice-a-val').innerText = computeDice(predA_L, predA_S).toFixed(3);
    document.getElementById('dice-b-val').innerText = computeDice(predB_L, predB_S).toFixed(3);

    drawBrainCanvas('cvs-model-a', predA_L, predA_S, false);
    drawBrainCanvas('cvs-model-b', predB_L, predB_S, true);
    
    if(simPlaying) toggleSim();
}

document.addEventListener("DOMContentLoaded", () => {
    initSimulation();
    resetSim();
});
