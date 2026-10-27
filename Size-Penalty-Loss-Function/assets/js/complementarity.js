/**
 * assets/js/complementarity.js
 * Logic for Figure 4: Complementary Gradients Chart
 */

function initComplementarity() {
    const ctxGrad = document.getElementById('grad-chart').getContext('2d');
    const vgVals = [];
    const diceGrads = [];
    const splGrads = [];

    // Helper: SPL weight
    function W_c(Vg) { return Math.exp(-Vg / 600); }

    for(let vg=10; vg<=3000; vg+=20) {
        vgVals.push(vg);
        
        // Dice gradient approx: dominated by total volume
        const diceG = 2.0 / ((2000 + vg) + 2000);
        diceGrads.push(diceG * 50); 

        // SPL gradient approx: W(vg) / vg
        const splG = W_c(vg) / vg;
        splGrads.push(splG * 50);
    }

    new Chart(ctxGrad, {
        type: 'line',
        data: {
            labels: vgVals,
            datasets: [
                {
                    label: 'Dice Gradient (Suppressed by 2000-voxel background)',
                    data: diceGrads,
                    borderColor: '#1f77b4',
                    borderWidth: 3,
                    pointRadius: 0,
                    tension: 0.1
                },
                {
                    label: 'SPL Gradient (Explicit Micro-Lesion Amplifier)',
                    data: splGrads,
                    borderColor: '#d62728',
                    borderWidth: 3,
                    pointRadius: 0,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { font: { family: 'Inter, sans-serif' } } },
                tooltip: { enabled: false }
            },
            scales: {
                x: { title: { display: true, text: 'Target Lesion Size Vg (voxels)', font: { family: 'Inter, sans-serif' } } },
                y: { 
                    type: 'logarithmic', 
                    title: { display: true, text: 'Theoretical Gradient Magnitude', font: { family: 'Inter, sans-serif' } },
                    min: 0.0001
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initComplementarity();
});
