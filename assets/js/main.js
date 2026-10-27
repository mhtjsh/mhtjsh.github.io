// ==========================================
// Site-wide LaTeX math support
// Use $...$ or \(...\) inline and $$...$$ or \[...\] for display math.
// ==========================================
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
  },
  chtml: {
    scale: 1,
    matchFontHeight: true
  }
};

if (!document.querySelector('script[data-mathjax]')) {
  const mathJaxScript = document.createElement('script');
  mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-chtml.js';
  mathJaxScript.async = true;
  mathJaxScript.dataset.mathjax = 'true';
  document.head.appendChild(mathJaxScript);
}

// ==========================================
// Theme toggle
// ==========================================
const html = document.documentElement;
const toggleBtn = document.getElementById('light-toggle');

function setTheme(t) {
  html.setAttribute('data-theme', t);
  if (toggleBtn) {
    toggleBtn.innerHTML = t === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    toggleBtn.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} theme`);
  }
  localStorage.setItem('theme', t);
}

const saved = localStorage.getItem('theme');
setTheme(saved === 'dark' ? 'dark' : 'light');

if (toggleBtn) {
  toggleBtn.onclick = () => setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
}

// ==========================================
// Mobile menu
// ==========================================
const menuBtn = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
if (menuBtn && navMenu) {
  menuBtn.onclick = () => navMenu.classList.toggle('open');
  navMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navMenu.classList.remove('open'))
  );
}

// ==========================================
// Floating section navigator and reading progress
// ==========================================
function createArticleNavigator() {
  if (document.getElementById('tocSidebar')) return;

  const article = document.querySelector('.article-page article');
  if (!article) return;

  const headings = Array.from(article.querySelectorAll('h2'));
  if (!headings.length) return;

  const usedIds = new Set(Array.from(document.querySelectorAll('[id]')).map(element => element.id));
  headings.forEach((heading, index) => {
    if (heading.id) return;

    const baseId = heading.textContent
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `section-${index + 1}`;
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
    heading.id = id;
    usedIds.add(id);
  });

  const sidebar = document.createElement('nav');
  sidebar.className = 'toc-sidebar blog-toc';
  sidebar.id = 'tocSidebar';
  sidebar.setAttribute('aria-label', 'Article sections');

  const trigger = document.createElement('button');
  trigger.className = 'toc-trigger';
  trigger.id = 'tocTrigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'tocPanel');
  trigger.setAttribute('aria-label', 'Open article index');
  trigger.innerHTML = '<i class="fa-solid fa-list-ul" aria-hidden="true"></i><span>Article</span>';

  const progress = document.createElement('div');
  progress.className = 'toc-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span id="tocProgress"></span>';

  const panel = document.createElement('div');
  panel.className = 'toc-panel';
  panel.id = 'tocPanel';
  panel.innerHTML = `
    <div class="toc-panel-head">
      <div>
        <div class="toc-kicker">Navigate</div>
        <div class="toc-title">In this article</div>
      </div>
      <button class="toc-close" id="tocClose" type="button" aria-label="Close article index"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
    </div>
  `;

  const list = document.createElement('ol');
  list.className = 'toc-list';
  headings.forEach((heading, index) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;

    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    const label = document.createTextNode(heading.textContent.replace(/^\d+\.\s*/, ''));
    link.append(number, label);
    item.appendChild(link);
    list.appendChild(item);
  });

  panel.appendChild(list);
  sidebar.append(trigger, progress, panel);
  document.body.appendChild(sidebar);
}

createArticleNavigator();

const tocSidebar = document.getElementById('tocSidebar');
const tocTrigger = document.getElementById('tocTrigger');
const tocPanel = document.getElementById('tocPanel');
const tocClose = document.getElementById('tocClose');
const tocProgress = document.getElementById('tocProgress');
const tocLinks = document.querySelectorAll('.toc-list a[href^="#"]');
const sectionIds = [];
// The desktop contents rail occupies only the existing left gutter.
const desktopTOC = window.matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine)');
tocLinks.forEach(link => {
  const id = link.getAttribute('href');
  if (id) sectionIds.push({ id: id.slice(1), link });
  link.setAttribute('aria-label', link.textContent.replace(/^\d+\s*/, '').trim());
});

function setTOCOpen(isOpen, remember = true) {
  if (!tocSidebar || !tocTrigger) return;
  const indexName = tocSidebar.classList.contains('blog-toc') ? 'article index' : 'page index';
  tocSidebar.classList.toggle('is-open', isOpen);
  tocTrigger.setAttribute('aria-expanded', String(isOpen));
  tocTrigger.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} ${indexName}`);
  if (tocPanel) tocPanel.inert = !desktopTOC.matches && !isOpen;
  if (desktopTOC.matches && remember) localStorage.setItem('toc-collapsed', String(!isOpen));
}

function syncTOCLayout() {
  setTOCOpen(desktopTOC.matches && localStorage.getItem('toc-collapsed') !== 'true', false);
}

desktopTOC.addEventListener('change', syncTOCLayout);
syncTOCLayout();

if (tocTrigger) {
  tocTrigger.addEventListener('click', () => {
    setTOCOpen(!tocSidebar.classList.contains('is-open'));
    if (desktopTOC.matches && tocClose) tocClose.focus({ preventScroll: true });
  });
}
if (tocClose) {
  tocClose.addEventListener('click', () => {
    setTOCOpen(false);
    tocTrigger.focus({ preventScroll: true });
  });
}
tocLinks.forEach(link => link.addEventListener('click', () => {
  if (!desktopTOC.matches) {
    setTOCOpen(false);
    tocTrigger.focus({ preventScroll: true });
  }
}));

document.addEventListener('click', event => {
  if (!desktopTOC.matches && tocSidebar && !tocSidebar.contains(event.target)) {
    setTOCOpen(false);
  }
});

function updateTOC() {
  let current = sectionIds[0]?.id || '';
  sectionIds.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 140) current = id;
  });

  sectionIds.forEach(({ id, link }) => {
    const active = id === current;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });

  if (tocProgress) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    tocProgress.style.height = `${percent}%`;
  }
}
window.addEventListener('scroll', updateTOC, { passive: true });
window.addEventListener('resize', updateTOC);
updateTOC();

// ==========================================
// Abstract toggle
// ==========================================
function toggleAbstract(btn) {
  const abstract = btn.nextElementSibling;
  const isOpen = abstract.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
}

// ==========================================
// Link Preview Tooltips
// ==========================================
const previewData = {
  'https://diffusion.csail.mit.edu/2026/index.html': {
    title: 'MIT 6.S184: Flow Matching and Diffusion Models',
    desc: 'A theory-first course on SDEs, flow matching, score matching, guidance, latent diffusion, and hands-on model construction.',
    type: 'Course'
  },
  'https://youtube.com/playlist?list=PLQZQ7N26C6ba2BDFVULmmBYC80cX6pNjZ&si=D9ri-o34Vft-JMTT': {
    title: 'Imitation Learning: A Series of Deep Dives',
    desc: 'A ten-part series by Prof. Sanjiban Choudhury on demonstrations, feedback, interventions, and interactive imitation learning.',
    type: 'Course'
  },
  'https://www.cs.cornell.edu/people/sanjiban-choudhury-0': {
    title: 'Prof. Sanjiban Choudhury',
    desc: 'Assistant Professor of Computer Science at Cornell University, working on imitation learning, reinforcement learning, and interactive AI agents.',
    type: 'Instructor'
  },
  'https://medicine.ucsf.edu/people/vivek-rudrapatna': {
    title: 'Dr. Vivek Rudrapatna',
    desc: 'Assistant Professor, Department of Medicine, UCSF. Research focuses on clinical informatics, EHR-based research methods, and drug repurposing using observational data.',
    type: 'Professor'
  },
  'https://www.kcdh.iitb.ac.in/~kshitij/browser/': {
    title: 'Dr. Kshitij Jadhav',
    desc: 'Assistant Professor at Koita Centre for Digital Health, IIT Bombay. Works on medical image analysis, computer-aided diagnosis, and deep learning for healthcare.',
    type: 'Professor'
  },
  'https://www.iitj.ac.in/People/Profile/dcba7c86-0698-466e-b17a-9504b80c2dd7': {
    title: 'Dr. Sucharita Dey',
    desc: 'Assistant Professor, Biosciences & Bioengineering Department, IIT Jodhpur. Research in structural biology, protein-DNA interactions, and computational biophysics.',
    type: 'Professor'
  },
  'Size-Penalty-Loss-Function/': {
    title: 'Size Penalty Loss — Project Page',
    desc: 'Interactive visual explanation of Size Penalty Loss for ischemic stroke segmentation. Explores the Dice blindspot and size-stratified gradients.',
    type: 'Project'
  },
  'assets/docs/Thesis.pdf': {
    title: 'Undergraduate Thesis',
    desc: '"What Dice Misses": Size-Stratified Volume Regularization for Ischemic Stroke Lesion Prognostication. B.Tech thesis submitted May 2026.',
    type: 'PDF'
  },
  'assets/docs/presentation.pdf': {
    title: 'Thesis Presentation Slides',
    desc: 'Defense slides for "What Dice Misses" — Size Penalty Loss for medical image segmentation.',
    type: 'PDF'
  },
  'assets/docs/Resume.pdf': {
    title: 'Curriculum Vitae',
    desc: 'Full academic CV — research appointments, projects, publications, technical skills, and awards.',
    type: 'PDF'
  },
  'https://github.com/mhtjsh/ProteinDNAInterfaceAnalysis': {
    title: 'Protein-DNA Interface Analysis',
    desc: 'Automated protein–DNA interface analysis pipeline using Snakemake, containerized with Docker.',
    type: 'GitHub'
  },
  'https://github.com/mhtjsh/covid19-scRNAseq-Tcell-analysis': {
    title: 'COVID-19 Immune Signature Analysis',
    desc: 'scRNA-seq pipeline in R analyzing post-COVID lung T cells to identify persistent pro-inflammatory signatures.',
    type: 'GitHub'
  },
  'https://github.com/mhtjsh/PINN': {
    title: 'Physics-Informed Neural Networks',
    desc: 'Solving Burgers equation and electrostatic potential through Laplace equation using PINNs.',
    type: 'GitHub'
  },
  'https://github.com/mhtjsh/PySR_and_SINDY_Comparision': {
    title: 'PySR & SINDy Epidemic Modeling',
    desc: 'Comparative analysis for epidemic spread modeling using Symbolic Regression and Sparse Identification.',
    type: 'GitHub'
  },
  'https://arxiv.org/abs/2601.03220': {
    title: 'Epiplexity: Epistemic Complexity',
    desc: 'Preprint: "Domain-Agnostic Implicit Rewards in Generative Models Decouple Reasoning Quality from Scale".',
    type: 'arXiv'
  },
  'https://arxiv.org/abs/2512.24601': {
    title: 'Recursive Language Models (RLMs)',
    desc: 'Preprint: Framework for systematic guardrails in Recursive Language Models through non-rewardable RL.',
    type: 'arXiv'
  }
};

let previewEl = null;
let previewTimeout = null;

function createPreviewEl() {
  if (previewEl) return;
  previewEl = document.createElement('div');
  previewEl.className = 'link-preview';
  document.body.appendChild(previewEl);
}

function showPreview(e, data, url) {
  createPreviewEl();
  previewEl.innerHTML = `
    <div class="link-preview-title">${data.title}</div>
    <div class="link-preview-url">${url}</div>
    <div class="link-preview-desc">${data.desc}</div>
    <span class="link-preview-type">${data.type}</span>
  `;
  const rect = e.target.getBoundingClientRect();
  let left = rect.left;
  let top = rect.bottom + 10;

  // Keep within viewport
  if (left + 340 > window.innerWidth) left = window.innerWidth - 360;
  if (left < 10) left = 10;
  if (top + 200 > window.innerHeight) top = rect.top - 150;

  previewEl.style.left = left + 'px';
  previewEl.style.top = top + 'px';

  requestAnimationFrame(() => previewEl.classList.add('visible'));
}

function hidePreview() {
  if (previewEl) previewEl.classList.remove('visible');
}

// Attach to all links that have preview data
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  
  // Skip internal anchors and email links
  if (href.startsWith('#') || href.startsWith('mailto:') || href === 'index.html') return;

  let data = previewData[href] || previewData[link.href];
  
  // Dynamically generate preview data for unspecified links
  if (!data) {
    let type = 'External Link';
    let urlObj;
    try {
      urlObj = new URL(link.href, window.location.href);
    } catch(e) {
      urlObj = { hostname: href };
    }
    
    let desc = `Click to visit ${urlObj.hostname}`;
    
    if (href.includes('github.com')) { type = 'GitHub'; desc = 'View repository or profile on GitHub.'; }
    else if (href.includes('arxiv.org')) { type = 'arXiv'; desc = 'View research paper on arXiv.'; }
    else if (href.includes('linkedin.com')) { type = 'LinkedIn'; desc = 'View LinkedIn profile.'; }
    else if (href.includes('x.com') || href.includes('twitter.com')) { type = 'Twitter/X'; desc = 'View profile on X.'; }
    else if (href.includes('.pdf')) { type = 'PDF'; desc = 'View PDF document.'; }
    
    let title = link.textContent.trim();
    if (!title) {
        title = urlObj.hostname;
    } else if (title.length > 55) {
        title = title.substring(0, 55) + '...';
    }

    data = {
      title: title,
      desc: desc,
      type: type
    };
  }

  link.addEventListener('mouseenter', (e) => {
    previewTimeout = setTimeout(() => showPreview(e, data, href), 300);
  });
  link.addEventListener('mouseleave', () => {
    clearTimeout(previewTimeout);
    hidePreview();
  });
  link.addEventListener('mousemove', (e) => {
    if (previewEl && previewEl.classList.contains('visible')) {
      let left = e.clientX + 15;
      let top = e.clientY + 15;
      if (left + 340 > window.innerWidth) left = e.clientX - 355;
      if (top + 180 > window.innerHeight) top = e.clientY - 170;
      previewEl.style.left = left + 'px';
      previewEl.style.top = top + 'px';
    }
  });
});


// ==========================================
// Command palette: major page sections only.
// ==========================================
let searchData = [];

function buildSearchIndex() {
  const sections = document.querySelectorAll('.research-profile-page > .container > section[id]');
  searchData = Array.from(sections, section => {
    const navLink = Array.from(tocLinks).find(link => link.getAttribute('href') === '#' + section.id);
    const heading = section.querySelector('h2');
    const title = navLink
      ? navLink.textContent.replace(/^\d+\s*/, '').trim()
      : heading ? heading.textContent.trim() : section.id;
    return { title, id: section.id };
  });
}

buildSearchIndex();

const cmdOverlay = document.getElementById('cmdOverlay');
const cmdInput = document.getElementById('cmdInput');
const cmdResults = document.getElementById('cmdResults');
const cmdBtn = document.getElementById('cmdBtn');
let selectedCmdIndex = 0;
let filteredData = [];
let cmdPreviousFocus = null;

if (cmdOverlay) cmdOverlay.inert = true;

function openCmd() {
  if (!cmdOverlay) return;
  cmdPreviousFocus = document.activeElement;
  cmdOverlay.inert = false;
  cmdOverlay.classList.add('active');
  if (cmdInput) cmdInput.value = '';
  renderCmdResults('');
  if (cmdInput) cmdInput.focus({ preventScroll: true });
}

function closeCmd() {
  if (!cmdOverlay) return;
  cmdOverlay.classList.remove('active');
  cmdOverlay.inert = true;
  if (cmdPreviousFocus) cmdPreviousFocus.focus({ preventScroll: true });
}

if (cmdBtn) cmdBtn.addEventListener('click', openCmd);

function renderCmdResults(query) {
  if (!cmdResults) return;
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const palette = document.querySelector('.cmd-palette');
  if (palette) palette.classList.add('has-results');
  filteredData = searchData.filter(item => terms.every(term => item.title.toLowerCase().includes(term)));
  selectedCmdIndex = 0;
  cmdResults.replaceChildren();

  if (!filteredData.length) {
    const empty = document.createElement('div');
    empty.className = 'cmd-empty';
    empty.setAttribute('role', 'status');
    empty.textContent = 'No matching sections.';
    cmdResults.appendChild(empty);
    return;
  }

  filteredData.forEach((item, index) => {
    const link = document.createElement('a');
    link.href = '#' + item.id;
    link.className = 'cmd-item' + (index === 0 ? ' selected' : '');
    link.dataset.index = index;
    const title = document.createElement('span');
    title.className = 'cmd-item-title';
    title.textContent = item.title;
    link.appendChild(title);
    link.addEventListener('click', closeCmd);
    link.addEventListener('mouseenter', () => {
      selectedCmdIndex = index;
      updateCmdSelection(cmdResults.querySelectorAll('.cmd-item'));
    });
    cmdResults.appendChild(link);
  });
}

if (cmdInput) {
  cmdInput.addEventListener('input', event => renderCmdResults(event.target.value));
  cmdInput.addEventListener('keydown', event => {
    if (!filteredData.length) return;
    const items = cmdResults.querySelectorAll('.cmd-item');
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      selectedCmdIndex = (selectedCmdIndex + direction + items.length) % items.length;
      updateCmdSelection(items);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      items[selectedCmdIndex]?.click();
    }
  });
}

function updateCmdSelection(items) {
  items.forEach(el => el.classList.remove('selected'));
  if (items[selectedCmdIndex]) {
    items[selectedCmdIndex].classList.add('selected');
    items[selectedCmdIndex].scrollIntoView({ block: 'nearest' });
  }
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (cmdOverlay && cmdOverlay.classList.contains('active')) {
      closeCmd();
    } else {
      openCmd();
    }
  }
  if (e.key === 'Escape' && cmdOverlay && cmdOverlay.classList.contains('active')) {
    closeCmd();
    return;
  }
  if (e.key === 'Escape') {
    const focusWasInTOC = tocSidebar && tocSidebar.contains(document.activeElement);
    setTOCOpen(false);
    if (focusWasInTOC && tocTrigger) tocTrigger.focus({ preventScroll: true });
  }
});

if (cmdOverlay) {
  cmdOverlay.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [cmdInput, ...cmdResults.querySelectorAll('.cmd-item')].filter(Boolean);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  cmdOverlay.addEventListener('click', (e) => {
    if (e.target === cmdOverlay) closeCmd();
  });
}
