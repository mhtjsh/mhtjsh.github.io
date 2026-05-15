with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Split content at the start of command palette
split_str = "// ==========================================\n// Command Palette"
parts = content.split(split_str)
clean_js = parts[0]

new_cmd_js = """// ==========================================
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
      const text = node.innerText.trim().replace(/\\n/g, ' ');
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
  if (q) {
    filteredData = searchData.filter(item => 
      item.rawText.toLowerCase().includes(q)
    ).slice(0, 8);
  } else {
    filteredData = searchData.filter(item => item.type === 'section').slice(0, 6);
  }
  
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
    openCmd();
  }
  if (e.key === 'Escape' && cmdOverlay && cmdOverlay.classList.contains('active')) {
    closeCmd();
  }
});

if (cmdOverlay) {
  cmdOverlay.addEventListener('click', (e) => {
    if (e.target === cmdOverlay) closeCmd();
  });
}
"""

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(clean_js + new_cmd_js)

print("Updated main.js with dynamic search")
