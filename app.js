// app.js
console.log('App loaded. Ready for NGFX logic.');

const settingsForm = document.getElementById('settings-form');

// Major pairs data (static for now)
const majorPairsData = [
  { symbol: 'EUR/USD', price: '1.0847', pct: 0.21, pip: 0.0023 },
  { symbol: 'GBP/USD', price: '1.2634', pct: -0.35, pip: -0.0045 },
  { symbol: 'USD/JPY', price: '149.82', pct: 0.45, pip: 0.67 },
  { symbol: 'AUD/USD', price: '0.6789', pct: -0.18, pip: -0.0012 },
];

function renderMajorPairs() {
  const list = document.getElementById('major-pairs-list');
  if (!list) return;
  list.innerHTML = '';
  majorPairsData.forEach(pair => {
    const card = document.createElement('div');
    card.className = 'major-pair-card';
    card.innerHTML = `
      <div class="major-pair-info">
        <span class="major-pair-symbol">${pair.symbol}</span>
        <span class="major-pair-price">${pair.price}</span>
      </div>
      <div class="major-pair-change">
        <span class="${pair.pct >= 0 ? 'pct-pos' : 'pct-neg'}">${pair.pct >= 0 ? '+' : ''}${pair.pct}%</span>
        <span class="${pair.pip >= 0 ? 'pip-pos' : 'pip-neg'}">${pair.pip >= 0 ? '+' : ''}${pair.pip}</span>
      </div>
    `;
    list.appendChild(card);
  });
}

// Settings form logic (handles personal info and preferences)
if (settingsForm) {
  function loadSettings() {
    document.getElementById('user-name').value = localStorage.getItem('ngfx_name') || '';
    document.getElementById('fav-pair').value = localStorage.getItem('ngfx_fav_pair') || '';
    document.getElementById('style').value = localStorage.getItem('ngfx_style') || '';
    document.getElementById('bio').value = localStorage.getItem('ngfx_bio') || '';
    document.getElementById('theme').value = localStorage.getItem('ngfx_theme') || 'system';
    document.getElementById('notifications').checked = localStorage.getItem('ngfx_notifications') === 'true';
  }
  settingsForm.addEventListener('submit', function(e) {
    e.preventDefault();
    localStorage.setItem('ngfx_name', document.getElementById('user-name').value);
    localStorage.setItem('ngfx_fav_pair', document.getElementById('fav-pair').value);
    localStorage.setItem('ngfx_style', document.getElementById('style').value);
    localStorage.setItem('ngfx_bio', document.getElementById('bio').value);
    localStorage.setItem('ngfx_theme', document.getElementById('theme').value);
    localStorage.setItem('ngfx_notifications', document.getElementById('notifications').checked);
    alert('Settings saved!');
    updateDashboardWelcome();
    renderProfile();
    applyTheme();
  });
  document.querySelector('.settings-reset-btn').addEventListener('click', function() {
    localStorage.removeItem('ngfx_name');
    localStorage.removeItem('ngfx_fav_pair');
    localStorage.removeItem('ngfx_style');
    localStorage.removeItem('ngfx_bio');
    localStorage.removeItem('ngfx_theme');
    localStorage.removeItem('ngfx_notifications');
    settingsForm.reset();
    loadSettings();
    alert('Settings reset.');
    updateDashboardWelcome();
    renderProfile();
    applyTheme();
  });
  loadSettings();
  renderProfile();
}
// Profile display logic (summary only)
function renderProfile() {
  const name = localStorage.getItem('ngfx_name') || '-';
  const favPair = localStorage.getItem('ngfx_fav_pair') || '-';
  const favPairPrice = majorPairsData.find(p => p.symbol === favPair)?.price || '';
  const style = localStorage.getItem('ngfx_style') || '-';
  const bio = localStorage.getItem('ngfx_bio') || '-';
  document.getElementById('profile-name').textContent = name;
  document.getElementById('profile-fav-pair').textContent = favPair;
  document.getElementById('profile-fav-pair-price').textContent = favPairPrice ? `(${favPairPrice})` : '';
  document.getElementById('profile-style').textContent = style;
  document.getElementById('profile-bio').textContent = bio;
  // Avatar: use initials if name exists
  const avatar = document.getElementById('profile-avatar');
  if (avatar) {
    if (name && name !== '-') {
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
      avatar.textContent = initials;
    } else {
      avatar.textContent = '👤';
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.ngfx-section');

  navBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active from all
      navBtns.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      // Add active to clicked
      this.classList.add('active');
      const target = this.getAttribute('data-target');
      document.getElementById(target).classList.add('active');
    });
  });

  // Personalized dashboard welcome
  function updateDashboardWelcome() {
    const name = localStorage.getItem('ngfx_name') || '';
    const welcomeSpan = document.getElementById('dashboard-welcome-name');
    if (welcomeSpan) {
      welcomeSpan.textContent = name ? `, ${name}` : '';
    }
  }

  // Call on load and after settings change
  updateDashboardWelcome();

  // Also update after saving settings
  if (settingsForm) {
    settingsForm.addEventListener('submit', function() {
      updateDashboardWelcome();
    });
  }

  // Dashboard nav card navigation
  const navCards = document.querySelectorAll('.ngfx-nav-card');
  navCards.forEach(card => {
    card.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = href.replace('#', '');
        // Switch section
        document.querySelectorAll('.ngfx-section').forEach(s => s.classList.remove('active'));
        const section = document.getElementById(target);
        if (section) section.classList.add('active');
        // Update bottom nav
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const navBtn = document.querySelector(`.nav-btn[data-target='${target}']`);
        if (navBtn) navBtn.classList.add('active');
      }
    });
  });

  // Profile form logic
  const profileForm = document.getElementById('profile-form');
  function loadProfile() {
    document.getElementById('profile-name-input').value = localStorage.getItem('ngfx_name') || '';
    document.getElementById('profile-fav-pair').value = localStorage.getItem('ngfx_fav_pair') || '';
    document.getElementById('profile-style').value = localStorage.getItem('ngfx_style') || '';
    document.getElementById('profile-bio').value = localStorage.getItem('ngfx_bio') || '';
  }
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      localStorage.setItem('ngfx_name', document.getElementById('profile-name-input').value);
      localStorage.setItem('ngfx_fav_pair', document.getElementById('profile-fav-pair').value);
      localStorage.setItem('ngfx_style', document.getElementById('profile-style').value);
      localStorage.setItem('ngfx_bio', document.getElementById('profile-bio').value);
      alert('Profile saved!');
      renderProfile();
      updateDashboardWelcome();
    });
    document.querySelector('.profile-reset-btn').addEventListener('click', function() {
      localStorage.removeItem('ngfx_name');
      localStorage.removeItem('ngfx_fav_pair');
      localStorage.removeItem('ngfx_style');
      localStorage.removeItem('ngfx_bio');
      profileForm.reset();
      loadProfile();
      alert('Profile reset.');
      renderProfile();
      updateDashboardWelcome();
    });
    loadProfile();
  }

  // Market Position Tool logic
  const mpForm = document.getElementById('market-position-form');
  const mpResult = document.getElementById('mp-result');
  if (mpForm && mpResult) {
    mpForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Get values
      const pair = document.getElementById('mp-pair').value;
      const stopLoss = parseFloat(document.getElementById('mp-stoploss').value);
      const riskPercent = parseFloat(document.getElementById('mp-risk-percent').value);
      const balance = parseFloat(document.getElementById('mp-balance').value);
      if (!pair || !stopLoss || !riskPercent || !balance) {
        mpResult.style.display = 'block';
        mpResult.innerHTML = '<span style="color: var(--color-danger);">Please fill in all fields.</span>';
        return;
      }
      // Calculate risk per trade
      const risk = balance * (riskPercent / 100);
      // Pip value per lot
      let pipValue = 0.0001;
      if (pair.endsWith('JPY')) pipValue = 0.01;
      // Lot size formula
      // Lot size = risk / (stopLoss * pipValue * 100000)
      // 100,000 is standard lot size
      const lotSize = risk / (stopLoss * pipValue * 100000);
      if (lotSize > 0 && isFinite(lotSize)) {
        mpResult.style.display = 'block';
        mpResult.innerHTML = `<strong>Recommended Lot Size:</strong> <span style="color: var(--color-success); font-size:1.2em;">${lotSize.toFixed(2)}</span>`;
      } else {
        mpResult.style.display = 'block';
        mpResult.innerHTML = '<span style="color: var(--color-danger);">Invalid input or calculation error.</span>';
      }
    });
  }

  // Tool card logic
  const toolCards = document.querySelectorAll('.tool-card');
  const toolsHome = document.getElementById('tools-home');
  const toolMarketPosition = document.getElementById('tool-market-position');
  const toolMarketHours = document.getElementById('tool-market-hours');
  const mpBackBtn = document.getElementById('mp-back-btn');
  const mhBackBtn = document.getElementById('mh-back-btn');
  function hideAllToolPages() {
    if (toolMarketPosition) toolMarketPosition.style.display = 'none';
    if (toolMarketHours) toolMarketHours.style.display = 'none';
    if (toolsHome) toolsHome.style.display = 'none';
  }
  toolCards.forEach(card => {
    card.addEventListener('click', function() {
      const tool = this.getAttribute('data-tool');
      hideAllToolPages();
      if (tool === 'market-position') {
        if (toolMarketPosition) toolMarketPosition.style.display = 'block';
      } else if (tool === 'market-hours') {
        if (toolMarketHours) toolMarketHours.style.display = 'block';
        renderMarketHours();
      }
    });
  });
  if (mpBackBtn) {
    mpBackBtn.addEventListener('click', function() {
      hideAllToolPages();
      if (toolsHome) toolsHome.style.display = 'grid';
      document.getElementById('market-position-form').reset();
      document.getElementById('mp-result').style.display = 'none';
    });
  }
  if (mhBackBtn) {
    mhBackBtn.addEventListener('click', function() {
      hideAllToolPages();
      if (toolsHome) toolsHome.style.display = 'grid';
    });
  }

  // Market hours logic
  const markets = [
    { name: 'Sydney', tz: 'Australia/Sydney', open: 7, close: 16 },
    { name: 'Tokyo', tz: 'Asia/Tokyo', open: 9, close: 18 },
    { name: 'London', tz: 'Europe/London', open: 8, close: 17 },
    { name: 'New York', tz: 'America/New_York', open: 8, close: 17 },
  ];
  const marketHoursTable = document.getElementById('market-hours-table');
  function renderMarketHours() {
    const table = document.getElementById('market-hours-table');
    if (!table) return;
    const now = new Date();
    let html = `<table style='width:100%;border-collapse:collapse;'>
      <tr><th style='text-align:left;'>Market</th><th>Local Time</th><th>Status</th></tr>`;
    markets.forEach(m => {
      const local = new Date(now.toLocaleString('en-US', { timeZone: m.tz }));
      const hour = local.getHours();
      const min = local.getMinutes();
      const open = m.open;
      const close = m.close;
      const isOpen = hour >= open && hour < close;
      html += `<tr style='background:${isOpen ? "var(--color-bg-btn-reset-hover)" : "none"};'>
        <td>${m.name}</td>
        <td>${local.getHours().toString().padStart(2, '0')}:${local.getMinutes().toString().padStart(2, '0')}</td>
        <td style='color:${isOpen ? "var(--color-success)" : "var(--color-danger)"};font-weight:600;'>${isOpen ? 'Open' : 'Closed'}</td>
      </tr>`;
    });
    html += '</table>';
    table.innerHTML = html;
  }
  // Auto-update market hours every minute when open
  let mhInterval;
  function startMarketHoursInterval() {
    if (mhInterval) clearInterval(mhInterval);
    mhInterval = setInterval(() => {
      if (marketHoursTool && marketHoursTool.style.display === 'block') {
        renderMarketHours();
      }
    }, 60000);
  }
  startMarketHoursInterval();

  renderMajorPairs();
  renderProfile();

  // Theme switching logic
  function applyTheme() {
    const theme = localStorage.getItem('ngfx_theme') || 'system';
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark');
    if (theme === 'dark') {
      body.classList.add('theme-dark');
    } else if (theme === 'light') {
      body.classList.add('theme-light');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('theme-dark');
      } else {
        body.classList.add('theme-light');
      }
    }
  }
  // Listen for system theme changes if system is selected
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
      if ((localStorage.getItem('ngfx_theme') || 'system') === 'system') {
        applyTheme();
      }
    });
  }
  // Call on load
  applyTheme();

  // Theme switching: update on theme select change
  const themeSelect = document.getElementById('theme');
  if (themeSelect) {
    themeSelect.addEventListener('change', function() {
      localStorage.setItem('ngfx_theme', themeSelect.value);
      applyTheme();
    });
  }

  // Custom number input logic for position tool
  document.querySelectorAll('.custom-number-input .num-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const action = this.getAttribute('data-action');
      const input = document.getElementById(targetId);
      if (!input) return;
      let step = parseFloat(input.step) || 1;
      let min = input.min !== '' ? parseFloat(input.min) : -Infinity;
      let max = input.max !== '' ? parseFloat(input.max) : Infinity;
      let value = input.value !== '' ? parseFloat(input.value) : (min !== -Infinity ? min : 0);
      if (action === 'increment') {
        value += step;
      } else if (action === 'decrement') {
        value -= step;
      }
      value = Math.max(min, Math.min(max, value));
      input.value = value.toFixed(input.step && input.step < 1 ? 2 : 0);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
});

// PWA installation prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('PWA install prompt ready');
}); 