/**
 * nav.js — Shared navigation component for Mabel
 * Set window.NAV_ACTIVE before loading this script.
 * Values: 'chat' | 'summarize' | 'flashcards' | 'quiz'
 */
(function () {
  var active = window.NAV_ACTIVE || 'chat';

  // ── Real user data from localStorage ──────────────────
  var firstName = localStorage.getItem('first_name') || '';
  var lastName  = localStorage.getItem('last_name')  || '';
  var fullName  = (firstName + ' ' + lastName).trim() || 'Guest';
  var initial   = firstName.charAt(0).toUpperCase()  || '?';

  var pages = [
    { id: 'chat',       label: 'Chat',       href: 'chat.html',        icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
    { id: 'summarize',  label: 'Summarize',  href: 'summarize.html',   icon: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/>' },
    { id: 'flashcards', label: 'Flashcards', href: 'flashcards2.html', icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>' },
    { id: 'quiz',       label: 'Quiz',       href: 'quiz.html',        icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  ];

  function svgIcon(inner, size) {
    size = size || 18;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }

  var navItems = pages.map(function(p) {
    return '<a class="sidebar-item' + (p.id === active ? ' active' : '') + '" href="' + p.href + '">' +
      svgIcon(p.icon) +
      '<span class="nav-text">' + p.label + '</span>' +
      '</a>';
  }).join('');

  function updateArrow() {
    var iconEl = document.getElementById('sidebar-arrow-icon');
    if (!iconEl) return;
    var collapsed = document.getElementById('sidebar').classList.contains('collapsed');
    iconEl.innerHTML = collapsed
      ? '<polyline points="9 18 15 12 9 6"/>'
      : '<polyline points="15 18 9 12 15 6"/>';
    if (window.innerWidth > 768) {
      var nav = document.querySelector('.nav');
      if (nav) nav.style.left = (collapsed ? '60px' : '220px');
    }
  }

  window.addEventListener('resize', function() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    if (window.innerWidth <= 768) {
      nav.style.left = '';
    } else {
      var collapsed = document.getElementById('sidebar').classList.contains('collapsed');
      nav.style.left = collapsed ? '60px' : '220px';
    }
  });

  window.MabelNav = {
    toggleTheme: function() {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    },
    toggleCollapse: function() {
      document.getElementById('sidebar').classList.toggle('collapsed');
      var collapsed = document.getElementById('sidebar').classList.contains('collapsed');
      localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0');
      updateArrow();
    },
    open: function() {
      document.getElementById('sidebar').classList.add('open');
      document.getElementById('sidebar-backdrop').classList.add('visible');
      document.getElementById('sidebar-trigger').classList.add('hidden');
      var nav = document.querySelector('.nav');
      if (nav) nav.classList.add('sidebar-open');
    },
    close: function() {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebar-backdrop').classList.remove('visible');
      document.getElementById('sidebar-trigger').classList.remove('hidden');
      var nav = document.querySelector('.nav');
      if (nav) nav.classList.remove('sidebar-open');
    },
    logout: function() {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('first_name');
      localStorage.removeItem('last_name');
      localStorage.removeItem('email');
      window.location.href = '../auth/login.html';
    }
  };

  window.toggleTheme           = window.MabelNav.toggleTheme;
  window.toggleSidebarCollapse = window.MabelNav.toggleCollapse;
  window.toggleSidebar         = window.MabelNav.open;
  window.closeSidebar          = window.MabelNav.close;
  window.logout                = window.MabelNav.logout;

  function inject() {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');

    var sidebarHTML = [
      '<aside class="sidebar" id="sidebar">',
        '<div class="sidebar-brand">',
          '<span class="nav-text sidebar-brand-name">Mabel</span>',
          '<span class="nav-text nav-badge" style="margin-left:2px">beta</span>',
          '<button class="sidebar-arrow-btn" id="sidebar-arrow-btn" onclick="MabelNav.toggleCollapse()" title="Toggle sidebar">',
            '<svg id="sidebar-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
              '<polyline points="15 18 9 12 15 6"/>',
            '</svg>',
          '</button>',
        '</div>',
        '<div class="sidebar-scroll">',
          '<div class="sidebar-label-row" style="display:flex;align-items:center;padding:10px 4px 4px">',
            '<span class="label-text" style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3)">Workspace</span>',
          '</div>',
          navItems,
          '<div class="sidebar-sep"></div>',
          '<div class="sidebar-label-row nav-text" style="display:flex;align-items:center;padding:10px 4px 4px">',
            '<span class="label-text" style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3)">History</span>',
          '</div>',
          // history-section is replaced by chat.html's injectHistorySection().
          // On all other pages this default renders the New chat shortcut.
          '<div id="history-section" class="nav-text" style="padding:0 0 8px">',
            '<a href="chat.html" class="history-new-btn nav-text" style="',
              'display:flex;align-items:center;gap:8px;',
              'width:100%;padding:8px 10px;margin-bottom:4px;',
              'background:none;border:1px solid var(--border);border-radius:8px;',
              'font-family:var(--font);font-size:12px;font-weight:600;',
              'color:var(--text-2);text-decoration:none;',
              'transition:all .15s;cursor:pointer;box-sizing:border-box;',
            '">',
              '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square">',
                '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
              '</svg>',
              'New chat',
            '</a>',
            '<div id="history-list">',
              '<div class="nav-text" style="font-size:12px;color:var(--text-3);font-style:italic;padding:4px 10px 8px;line-height:1.5">No sessions yet</div>',
            '</div>',
          '</div>',
        '</div>',
        '<div class="sidebar-footer">',
          '<a class="user-row" href="settings.html">',
            '<div class="avatar" id="nav-avatar">' + initial + '</div>',
            '<div class="user-info">',
              '<div class="user-name" id="nav-user-name">' + fullName + '</div>',
              '<div class="user-plan">',
                '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
                'Learner',
              '</div>',
            '</div>',
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-3)"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>',
          '</a>',
          '<button onclick="MabelNav.logout()" style="width:100%;margin-top:6px;padding:8px;background:none;border:1px solid var(--border);border-radius:var(--radius-sm);font-family:var(--font);font-size:13px;color:var(--text-3);cursor:pointer;transition:all .15s;" onmouseover="this.style.color=\'var(--red)\';this.style.borderColor=\'var(--red)\'" onmouseout="this.style.color=\'var(--text-3)\';this.style.borderColor=\'var(--border)\'">',
            'Sign out',
          '</button>',
        '</div>',
      '</aside>',
    ].join('');

    var overlayHTML = [
      '<div class="sidebar-backdrop" id="sidebar-backdrop" onclick="MabelNav.close()"></div>',
      '<button class="sidebar-trigger" id="sidebar-trigger" onclick="MabelNav.open()" aria-label="Open menu">',
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">',
          '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
        '</svg>',
      '</button>',
      '<nav class="nav" id="mabel-nav">',
        '<div class="nav-right">',
          '<a class="nav-btn hide-mobile" href="#">Docs</a>',
          '<a class="nav-btn hide-mobile" href="https://github.com/GabrielOlufemi/mabel" target="_blank">',
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
            'GitHub',
          '</a>',
          '<a class="nav-btn primary" href="#">Demo</a>',
        '</div>',
      '</nav>',
    ].join('');

    var layout = document.querySelector('.layout');
    if (layout) {
      layout.insertAdjacentHTML('afterbegin', sidebarHTML);
    } else {
      document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    }

    document.body.insertAdjacentHTML('afterbegin', overlayHTML);

    if (localStorage.getItem('sidebar-collapsed') === '1') {
      document.getElementById('sidebar').classList.add('collapsed');
    }
    updateArrow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();