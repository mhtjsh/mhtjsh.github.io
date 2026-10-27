/**
 * assets/js/landscape.js
 * Logic for Figure 3: Interactive Loss Landscape
 */

let landPlaying = false;
let landRaf;
let particles = [];

function initLandscape() {
    const cvsLand = document.getElementById('cvs-landscape');
    if (!cvsLand) return;
    
    // Initial 4 particles
    particles = [
        {vg: 50, color: '#d62728', r: 4.5, dir: 1, trail:[]},
        {vg: 300, color: '#ff7f0e', r: 4.5, dir: 1, trail:[]},
        {vg: 800, color: '#1f77b4', r: 4.5, dir: 1, trail:[]},
        {vg: 2500, color: '#2ca02c', r: 4.5, dir: 1, trail:[]}
    ];

    cvsLand.addEventListener('mousedown', (e) => {
        const rect = cvsLand.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const w = cvsLand.width;
        const h = cvsLand.height;
        
        const vg = (x / w) * 3000;
        const r = ((h - y) / h) * 5.0;
        
        const dir = r > 1.0 ? 1 : -1;
        
        // Spawn particle with a purple color
        particles.push({vg: vg, color: '#9c27b0', r: r, dir: dir, trail:[]});
    });

    // Intersection Observer to pause/play based on visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!landPlaying) {
                    toggleLand(); // auto-play when scrolled into view
                }
            } else {
                if (landPlaying) {
                    toggleLand(); // pause when scrolled out
                }
            }
        });
    }, { threshold: 0.2 });

    observer.observe(document.getElementById('fig3'));
}

window.clearParticles = function() {
    particles = [];
}

function drawLandBackground(w, h, ctxLand) {
    const isDark = document.documentElement.dataset.theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDark ? '#aaaaaa' : '#666666';

    // Grid
    ctxLand.strokeStyle = gridColor;
    ctxLand.lineWidth = 1;
    for(let i=1; i<10; i++) {
        ctxLand.beginPath(); ctxLand.moveTo(0, h*(i/10)); ctxLand.lineTo(w, h*(i/10)); ctxLand.stroke();
        ctxLand.beginPath(); ctxLand.moveTo(w*(i/10), 0); ctxLand.lineTo(w*(i/10), h); ctxLand.stroke();
    }

    // Contours L = C
    const contours = [0.2, 0.5, 1.0, 2.0, 3.5];
    ctxLand.lineWidth = 1;
    ctxLand.strokeStyle = isDark ? 'rgba(255, 100, 100, 0.35)' : 'rgba(214, 39, 40, 0.15)';
    
    contours.forEach(C => {
        // Upper contour (r > 1)
        ctxLand.beginPath();
        for(let x=0; x<=w; x+=5) {
            const vg = (x/w) * 3000;
            const r_diff = C * Math.exp(vg / 600);
            const r_upper = 1.0 + r_diff;
            const y = h - ((r_upper / 5.0) * h);
            if(x===0) ctxLand.moveTo(x, y);
            else ctxLand.lineTo(x, y);
        }
        ctxLand.stroke();
        
        // Lower contour (r < 1)
        ctxLand.beginPath();
        for(let x=0; x<=w; x+=5) {
            const vg = (x/w) * 3000;
            const r_diff = C * Math.exp(vg / 600);
            const r_lower = 1.0 - r_diff;
            const y = h - ((r_lower / 5.0) * h);
            if(x===0) ctxLand.moveTo(x, y);
            else ctxLand.lineTo(x, y);
        }
        ctxLand.stroke();
    });

    // Axes labels
    ctxLand.fillStyle = textColor;
    ctxLand.font = '12px "Inter", sans-serif';
    ctxLand.fillText('Ratio Vp/Vg', 10, 20);
    ctxLand.fillText('Ground Truth Vg ->', w - 120, h - 10);

    // Optimal Line (Ratio = 1.0)
    const optY = h - (1.0/5.0)*h;
    ctxLand.strokeStyle = '#2ca02c';
    ctxLand.setLineDash([5,5]);
    ctxLand.beginPath(); ctxLand.moveTo(0, optY); ctxLand.lineTo(w, optY); ctxLand.stroke();
    ctxLand.setLineDash([]);
    ctxLand.fillStyle = '#2ca02c';
    ctxLand.fillText('Optimal Manifold (Ratio 1.0)', 10, optY - 10);
}

function W_land(Vg) { return Math.exp(-Vg / 600); }

function landLoop() {
    if(!landPlaying) return;
    const cvsLand = document.getElementById('cvs-landscape');
    const ctxLand = cvsLand.getContext('2d');
    
    cvsLand.width = cvsLand.parentElement.clientWidth;
    cvsLand.height = cvsLand.parentElement.clientHeight;
    const w = cvsLand.width; const h = cvsLand.height;

    ctxLand.clearRect(0, 0, w, h);
    drawLandBackground(w, h, ctxLand);

    particles.forEach(p => {
        const weight = W_land(p.vg);
        const speed = 0.04 * weight; 
        p.r -= p.dir * speed;
        
        if ((p.dir === 1 && p.r <= 1.0) || (p.dir === -1 && p.r >= 1.0)) {
            p.r = 1.0;
        }

        const y = h - ((p.r / 5.0) * h);
        const x = (p.vg / 3000) * w;

        if (p.r !== 1.0) {
            p.trail.push({x,y});
            if(p.trail.length > 40) p.trail.shift();
        }

        // Draw trail
        p.trail.forEach((pt, i) => {
            ctxLand.fillStyle = p.color;
            ctxLand.globalAlpha = i / 40;
            ctxLand.beginPath(); ctxLand.arc(pt.x, pt.y, 2, 0, Math.PI*2); ctxLand.fill();
        });
        ctxLand.globalAlpha = 1.0;

        // Draw particle
        ctxLand.fillStyle = p.color;
        ctxLand.beginPath(); ctxLand.arc(x, y, 6, 0, Math.PI*2); ctxLand.fill();
        ctxLand.strokeStyle = '#fff';
        ctxLand.lineWidth = 1.5;
        ctxLand.stroke();
    });

    landRaf = requestAnimationFrame(landLoop);
}

window.toggleLand = function() {
    landPlaying = !landPlaying;
    const btn = document.getElementById('btn-land-play');
    if(btn) btn.innerText = landPlaying ? '⏸ Pause Descent' : '▶ Play Descent';
    if (landPlaying) {
        landRaf = requestAnimationFrame(landLoop);
    } else {
        cancelAnimationFrame(landRaf);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initLandscape();
});
