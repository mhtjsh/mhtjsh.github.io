/** Presentation and navigation only. Figure calculations live in the four original scripts. */
document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const sidebar = document.getElementById('tocSidebar');
    const trigger = document.getElementById('tocTrigger');
    const panel = document.getElementById('tocPanel');
    const close = document.getElementById('tocClose');
    const themeButton = document.getElementById('projectThemeToggle');
    const links = Array.from(document.querySelectorAll('.toc-list a'));
    const sections = links.map(link => document.getElementById(link.getAttribute('href').slice(1)));
    const desktop = window.matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine)');

    function setOpen(open, remember = true) {
        sidebar.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', String(open));
        trigger.setAttribute('aria-label', `${open ? 'Close' : 'Open'} project index`);
        panel.inert = !desktop.matches && !open;
        if (desktop.matches && remember) localStorage.setItem('toc-collapsed', String(!open));
    }
    function syncLayout() {
        setOpen(desktop.matches && localStorage.getItem('toc-collapsed') !== 'true', false);
    }
    trigger.addEventListener('click', () => {
        setOpen(!sidebar.classList.contains('is-open'));
        if (desktop.matches) close.focus({ preventScroll: true });
    });
    close.addEventListener('click', () => {
        setOpen(false);
        trigger.focus({ preventScroll: true });
    });
    links.forEach(link => link.addEventListener('click', () => {
        if (!desktop.matches) {
            setOpen(false);
            trigger.focus({ preventScroll: true });
        }
    }));
    document.addEventListener('click', event => {
        if (!desktop.matches && !sidebar.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            const hadFocus = sidebar.contains(document.activeElement);
            setOpen(false);
            if (hadFocus) trigger.focus({ preventScroll: true });
        }
    });
    desktop.addEventListener('change', syncLayout);
    syncLayout();

    function updateActiveSection() {
        let active = sections[0];
        sections.forEach(section => {
            if (section && section.getBoundingClientRect().top <= 140) active = section;
        });
        links.forEach((link, index) => {
            const isActive = sections[index] === active;
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    updateActiveSection();

    function setTheme(theme) {
        root.dataset.theme = theme === 'dark' ? 'dark' : 'light';
        localStorage.setItem('theme', root.dataset.theme);
        const dark = root.dataset.theme === 'dark';
        themeButton.innerHTML = `<i class="fa-solid fa-${dark ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
        themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
        if (typeof Chart !== 'undefined') {
            const textColor = dark ? '#cccccc' : '#666666';
            Chart.defaults.color = textColor;
            Chart.defaults.font.family = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            Chart.defaults.scale.grid.color = dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
            Chart.defaults.scale.ticks.color = textColor;
            Chart.defaults.plugins.title.color = textColor;
            Object.values(Chart.instances).forEach(chart => chart.update('none'));
        }
        // Refresh paused canvases without advancing the simulation.
        if (typeof drawBrainCanvas === 'function') {
            drawBrainCanvas('cvs-model-a', predA_L, predA_S, false);
            drawBrainCanvas('cvs-model-b', predB_L, predB_S, true);
        }
        if (typeof drawLandBackground === 'function') {
            const canvas = document.getElementById('cvs-landscape');
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawLandBackground(canvas.width, canvas.height, context);
            if (typeof particles !== 'undefined') {
                particles.forEach(particle => {
                    particle.trail.forEach((point, index) => {
                        context.fillStyle = particle.color;
                        context.globalAlpha = index / 40;
                        context.beginPath();
                        context.arc(point.x, point.y, 2, 0, Math.PI * 2);
                        context.fill();
                    });
                    context.globalAlpha = 1;
                    context.fillStyle = particle.color;
                    context.beginPath();
                    context.arc((particle.vg / 3000) * canvas.width, canvas.height * (1 - particle.r / 5), 6, 0, Math.PI * 2);
                    context.fill();
                    context.strokeStyle = '#fff';
                    context.lineWidth = 1.5;
                    context.stroke();
                });
            }
        }
    }
    themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
    window.addEventListener('storage', event => {
        if (event.key === 'theme') setTheme(event.newValue);
    });
    setTheme(localStorage.getItem('theme'));
});
