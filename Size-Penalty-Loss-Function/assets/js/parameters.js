/**
 * assets/js/parameters.js
 * Logic for Figure 2: Interactive Parameter Space Analysis
 */

const EPS = 1e-5;
const CAP = 10;

function W(Vg, tau) { return Math.exp(-Vg / tau); }
function Erel(Vp, Vg) { if(Vg<=0) return 0; return Math.abs(Vp - Vg) / (Vg + EPS); }
function Lsize(Vp, Vg, tau) { if(Vg<=0) return 0; return Math.min(CAP, W(Vg, tau) * Erel(Vp, Vg)); }

let paramChart;

function initParameters() {
    const ctxParam = document.getElementById('param-chart').getContext('2d');
    paramChart = new Chart(ctxParam, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'W(Vg)',
                    data: [],
                    borderColor: '#1f77b4',
                    borderWidth: 2,
                    tension: 0.2,
                    pointRadius: 0
                },
                {
                    label: 'Current Vg',
                    data: [],
                    backgroundColor: '#d62728',
                    borderColor: '#d62728',
                    pointRadius: 6,
                    type: 'scatter'
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false, animation: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                x: { type: 'linear', min: 0, max: 3000, title: { display: true, text: 'Ground Truth Volume Vg', font: {family: 'Inter, sans-serif'} } },
                y: { min: 0, max: 1.05, title: { display: true, text: 'Weight W(Vg)', font: {family: 'Inter, sans-serif'} } }
            }
        }
    });

    // Initial update
    updateParams();
}

window.updateParams = function() {
    const vgEl = document.getElementById('param-vg');
    const vpEl = document.getElementById('param-vp');
    const tauEl = document.getElementById('param-tau');
    
    if(!vgEl || !vpEl || !tauEl) return;

    const vg = +vgEl.value;
    const vp = +vpEl.value;
    const tau = +tauEl.value;

    document.getElementById('val-vg').innerText = vg;
    document.getElementById('val-vp').innerText = vp;
    document.getElementById('val-tau').innerText = tau;

    const w = W(vg, tau);
    const e = Erel(vp, vg);
    const loss = Lsize(vp, vg, tau);
    const ratio = vg > 0 ? (vp/vg).toFixed(2) : 0;

    document.getElementById('out-ratio').innerText = ratio;
    document.getElementById('out-w').innerText = w.toFixed(4);
    document.getElementById('out-e').innerText = e.toFixed(4);
    document.getElementById('out-l').innerText = loss.toFixed(4);

    document.getElementById('clamp-warn').style.display = (w*e >= CAP) ? 'block' : 'none';

    // Update Chart Curve
    const curveData = [];
    for(let i=0; i<=3000; i+=50) { curveData.push({x: i, y: W(i, tau)}); }
    
    if (paramChart) {
        paramChart.data.datasets[0].data = curveData;
        paramChart.data.datasets[1].data = [{x: vg, y: w}];
        paramChart.update();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initParameters();
});
