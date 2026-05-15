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
// TOC sidebar: active section tracking
// ==========================================
const tocLinks = document.querySelectorAll('.toc-list a');
const tocDots = document.querySelectorAll('.toc-dot');
const sectionIds = [];
tocLinks.forEach((link, i) => {
  const id = link.getAttribute('href');
  if (id && id.startsWith('#')) sectionIds.push({ id: id.slice(1), link, dot: tocDots[i] });
});

function calculateTOCHeights() {
  sectionIds.forEach(({ id, dot }, i) => {
    const el = document.getElementById(id);
    if (el && dot) {
       const nextEl = sectionIds[i+1] ? document.getElementById(sectionIds[i+1].id) : null;
       const sectionHeight = nextEl ? (nextEl.offsetTop - el.offsetTop) : (document.documentElement.scrollHeight - el.offsetTop);
       dot.style.flex = Math.max(sectionHeight, 50); // proportional to section height
    }
  });
}
window.addEventListener('resize', calculateTOCHeights);
window.addEventListener('load', calculateTOCHeights);
setTimeout(calculateTOCHeights, 500);

function updateTOC() {
  let current = '';
  sectionIds.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
  });

  if (current !== window.currentSection && window.currentSection !== undefined) {
    const sidebar = document.getElementById('tocSidebar');
    if (sidebar) {
      sidebar.classList.add('peek');
      clearTimeout(window.peekTimeout);
      window.peekTimeout = setTimeout(() => {
        sidebar.classList.remove('peek');
      }, 1500);
    }
  }
  window.currentSection = current;

  sectionIds.forEach(({ id, link, dot }) => {
    const active = id === current;
    link.classList.toggle('active', active);
    if (dot) dot.classList.toggle('active', active);
  });
}
window.addEventListener('scroll', updateTOC, { passive: true });
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
