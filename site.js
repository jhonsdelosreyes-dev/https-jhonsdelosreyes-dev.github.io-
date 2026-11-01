/* Portfolio front-end behavior: mobile menu, dark mode, project search/filter.
   Theme is applied early by an inline script in the layout <head> to avoid a flash. */
(function () {
  'use strict';

  /* ---------- Dark / light mode ---------- */
  var THEME_KEY = 'portfolio-theme';
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme-toggle');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
  if (themeBtn) {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage blocked */ }
    });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    function closeMenu() {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
    });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  }

  /* ---------- Project search + filters (no page reload) ---------- */
  var list = document.getElementById('project-list');
  if (list) {
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-project]'));
    var q = document.getElementById('f-search');
    var selects = {
      category: document.getElementById('f-category'),
      year: document.getElementById('f-year'),
      type: document.getElementById('f-type'),
      tech: document.getElementById('f-tech')
    };
    var count = document.getElementById('result-count');
    var empty = document.getElementById('no-results');
    var clear = document.getElementById('f-clear');

    function norm(s) { return String(s || '').toLowerCase().trim(); }

    function apply() {
      var term = norm(q.value);
      var shown = 0;
      cards.forEach(function (card) {
        var ok = true;
        // free-text: name, technology, category, year, type (all in data-search)
        if (term && norm(card.getAttribute('data-search')).indexOf(term) === -1) ok = false;
        if (ok && selects.category.value && card.getAttribute('data-category') !== selects.category.value) ok = false;
        if (ok && selects.year.value && card.getAttribute('data-year') !== selects.year.value) ok = false;
        if (ok && selects.type.value && card.getAttribute('data-type') !== selects.type.value) ok = false;
        if (ok && selects.tech.value) {
          var techs = card.getAttribute('data-tech').split('|');
          if (techs.indexOf(selects.tech.value) === -1) ok = false;
        }
        card.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = shown + ' of ' + cards.length + ' project' + (cards.length === 1 ? '' : 's');
      empty.hidden = shown !== 0;
    }

    q.addEventListener('input', apply);
    Object.keys(selects).forEach(function (k) { selects[k].addEventListener('change', apply); });
    clear.addEventListener('click', function () {
      q.value = '';
      Object.keys(selects).forEach(function (k) { selects[k].value = ''; });
      apply();
      q.focus();
    });
    apply();
  }
})();
