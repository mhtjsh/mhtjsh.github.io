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
  html.classList.add('transition');
  html.setAttribute('data-theme', t);
  if (toggleBtn) {
    toggleBtn.innerHTML = t === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }
  localStorage.setItem('theme', t);
  setTimeout(() => html.classList.remove('transition'), 650);
}

const saved = localStorage.getItem('theme');
if (saved) setTheme(saved);

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
let tocCloseTimer = null;
let tocPinnedOpen = false;
tocLinks.forEach(link => {
  const id = link.getAttribute('href');
  if (id) sectionIds.push({ id: id.slice(1), link });
});

function setTOCOpen(isOpen) {
  if (!tocSidebar || !tocTrigger) return;
  const indexName = tocSidebar.classList.contains('blog-toc') ? 'article index' : 'page index';
  tocSidebar.classList.toggle('is-open', isOpen);
  tocTrigger.setAttribute('aria-expanded', String(isOpen));
  tocTrigger.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} ${indexName}`);
}

function cancelTOCClose() {
  if (tocCloseTimer) window.clearTimeout(tocCloseTimer);
  tocCloseTimer = null;
}

function openTOCOnHover() {
  cancelTOCClose();
  setTOCOpen(true);
}

function scheduleTOCClose() {
  cancelTOCClose();
  if (tocPinnedOpen) return;
  tocCloseTimer = window.setTimeout(() => setTOCOpen(false), 350);
}

if (tocTrigger) {
  tocTrigger.addEventListener('click', () => {
    cancelTOCClose();
    tocPinnedOpen = !tocPinnedOpen;
    setTOCOpen(tocPinnedOpen);
  });
}
if (tocSidebar && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  tocSidebar.addEventListener('mouseenter', openTOCOnHover);
  tocSidebar.addEventListener('mouseleave', scheduleTOCClose);
  if (tocPanel) {
    tocPanel.addEventListener('mouseenter', openTOCOnHover);
    tocPanel.addEventListener('mouseleave', scheduleTOCClose);
  }
}
if (tocClose) {
  tocClose.addEventListener('click', () => {
    tocPinnedOpen = false;
    setTOCOpen(false);
  });
}
tocLinks.forEach(link => link.addEventListener('click', () => {
  tocPinnedOpen = false;
  setTOCOpen(false);
}));

document.addEventListener('click', event => {
  if (tocSidebar && tocSidebar.classList.contains('is-open') && !tocSidebar.contains(event.target)) {
    tocPinnedOpen = false;
    setTOCOpen(false);
  }
});

function updateTOC() {
  let current = '';
  sectionIds.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
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
  'https://mhtjsh.github.io/Size-Penalty-Loss-Function/': {
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
// Command Palette (Dynamic DOM Search)
// ==========================================
let searchData = [];

function buildSearchIndex() {
  searchData = [];
  const container = document.querySelector('.container');
  if (!container) return;
  
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec => {
    const secId = sec.id;
    const h2 = sec.querySelector('h2');
    const secTitle = h2 ? h2.innerText : secId.charAt(0).toUpperCase() + secId.slice(1);
    
    // Add section
    searchData.push({
      title: secTitle,
      desc: 'Section',
      id: secId,
      type: 'section',
      rawText: secTitle
    });

    // Add text nodes inside section
    const textNodes = sec.querySelectorAll('p, li, .pub-title, .post-title, h3, .pub-abstract');
    textNodes.forEach((node, idx) => {
      const text = node.innerText.trim().replace(/\n/g, ' ');
      if (text.length > 15) {
        let nodeId = node.id;
        if (!nodeId) {
          nodeId = `search-node-${secId}-${idx}`;
          node.id = nodeId;
        }
        searchData.push({
          title: text.substring(0, 65) + (text.length > 65 ? '...' : ''),
          desc: `In ${secTitle}`,
          id: nodeId,
          type: 'text',
          rawText: text
        });
      }
    });
  });
}

// Call initially
setTimeout(buildSearchIndex, 500);

const cmdOverlay = document.getElementById('cmdOverlay');
const cmdInput = document.getElementById('cmdInput');
const cmdResults = document.getElementById('cmdResults');
const cmdBtn = document.getElementById('cmdBtn');
let selectedCmdIndex = 0;
let filteredData = [];

function openCmd() {
  if(!cmdOverlay) return;
  cmdOverlay.classList.add('active');
  if(cmdInput) {
    cmdInput.value = '';
    setTimeout(() => cmdInput.focus(), 50);
  }
  renderCmdResults('');
}

function closeCmd() {
  if(!cmdOverlay) return;
  cmdOverlay.classList.remove('active');
  if(cmdInput) cmdInput.blur();
}

if (cmdBtn) cmdBtn.addEventListener('click', openCmd);

function renderCmdResults(query) {
  if(!cmdResults) return;
  const q = query.toLowerCase().trim();
  const palette = document.querySelector('.cmd-palette');
  
  if (!q) {
    filteredData = [];
    cmdResults.innerHTML = '';
    if (palette) palette.classList.remove('has-results');
    return;
  }
  
  if (palette) palette.classList.add('has-results');

  filteredData = searchData.filter(item => 
    item.rawText.toLowerCase().includes(q)
  ).slice(0, 8);
  
  selectedCmdIndex = 0;
  
  if (filteredData.length === 0) {
    cmdResults.innerHTML = '<div class="cmd-empty">No results found.</div>';
    return;
  }

  cmdResults.innerHTML = filteredData.map((item, i) => `
    <a href="#${item.id}" class="cmd-item ${i === 0 ? 'selected' : ''}" data-index="${i}">
      <div class="cmd-item-title">${item.title}</div>
      <div class="cmd-item-desc">${item.desc}</div>
    </a>
  `).join('');

  document.querySelectorAll('.cmd-item').forEach(el => {
    el.addEventListener('click', () => closeCmd());
    el.addEventListener('mouseenter', () => {
      document.querySelectorAll('.cmd-item').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      selectedCmdIndex = parseInt(el.getAttribute('data-index'));
    });
  });
}

if (cmdInput) {
  cmdInput.addEventListener('input', (e) => renderCmdResults(e.target.value));

  cmdInput.addEventListener('keydown', (e) => {
    if (filteredData.length === 0) return;
    const items = document.querySelectorAll('.cmd-item');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedCmdIndex = (selectedCmdIndex + 1) % filteredData.length;
      updateCmdSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedCmdIndex = (selectedCmdIndex - 1 + filteredData.length) % filteredData.length;
      updateCmdSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedCmdIndex]) items[selectedCmdIndex].click();
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
  }
  if (e.key === 'Escape') {
    tocPinnedOpen = false;
    setTOCOpen(false);
  }
});

if (cmdOverlay) {
  cmdOverlay.addEventListener('click', (e) => {
    if (e.target === cmdOverlay) closeCmd();
  });
}
