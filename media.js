/* Interactive media: gallery filter, lightbox (images + PDFs), custom video player, CV link guard.
   Runs after render.js has built the DOM. */
(function () {
  'use strict';
  var M = window.PORTFOLIO_MEDIA || { graphics: [], videos: [], certificates: [], cv: {} };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
  function extOf(f) { var m = /\.([a-z0-9]+)(?:[?#].*)?$/i.exec(String(f || '')); return m ? m[1].toLowerCase() : ''; }
  function fname(title, file) { return String(title).replace(/[^\w\-]+/g, '-') + '.' + extOf(file); }

  /* ---------- Graphics: category filter ---------- */
  var tabs = document.getElementById('g-tabs');
  if (tabs) {
    var cards = [].slice.call(document.querySelectorAll('#g-list [data-graphic]'));
    var count = document.getElementById('g-count'), none = document.getElementById('g-none');
    var apply = function (cat) {
      var shown = 0;
      cards.forEach(function (c) { var ok = !cat || c.getAttribute('data-category') === cat; c.hidden = !ok; if (ok) shown++; });
      count.textContent = shown + ' of ' + cards.length + ' design' + (cards.length === 1 ? '' : 's');
      none.hidden = shown !== 0 || !cards.length;
      [].forEach.call(tabs.querySelectorAll('.tab'), function (t) {
        var on = t.getAttribute('data-filter') === cat; t.classList.toggle('is-active', on); t.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    };
    tabs.addEventListener('click', function (e) {
      var t = e.target.closest('.tab'); if (t && !t.disabled) apply(t.getAttribute('data-filter'));
    });
    apply('');
  }

  /* ---------- Lightbox ---------- */
  var lb = null, lbItems = [], lbIndex = 0, lbKind = '', lastFocus = null;
  function buildLb() {
    lb = el('div', 'lb'); lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Preview');
    lb.innerHTML =
      '<button class="lb-close" type="button" aria-label="Close preview">✕</button>' +
      '<button class="lb-nav lb-prev" type="button" aria-label="Previous">‹</button>' +
      '<div class="lb-stage" id="lb-stage"></div>' +
      '<button class="lb-nav lb-next" type="button" aria-label="Next">›</button>' +
      '<div class="lb-cap"><div><span class="lb-cat" id="lb-cat"></span><strong id="lb-title"></strong><p id="lb-desc"></p></div>' +
      '<div class="lb-actions" id="lb-actions"></div></div>';
    document.body.appendChild(lb);
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb();
    });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { go(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { go(1); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'Tab') { // keep focus inside the dialog
        var f = [].slice.call(lb.querySelectorAll('button, a[href]')).filter(function (x) { return !x.hidden && x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
  function visibleItems(kind) {
    if (kind === 'graphics') {
      var vis = [].slice.call(document.querySelectorAll('[data-graphic]')).filter(function (c) { return !c.hidden; })
        .map(function (c) { return +c.getAttribute('data-index'); });
      return vis.length ? vis : M.graphics.map(function (_, i) { return i; });
    }
    return M[kind].map(function (_, i) { return i; });
  }
  function openLb(kind, index, trigger) {
    if (!lb) buildLb();
    lbKind = kind; lbItems = visibleItems(kind);
    lbIndex = Math.max(0, lbItems.indexOf(index));
    lastFocus = trigger || document.activeElement;
    lb.hidden = false; document.body.classList.add('lb-lock');
    render(); lb.querySelector('.lb-close').focus();
  }
  function closeLb() {
    lb.hidden = true; document.body.classList.remove('lb-lock');
    document.getElementById('lb-stage').innerHTML = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function go(d) { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; render(); }
  function render() {
    var item = M[lbKind][lbItems[lbIndex]], stage = document.getElementById('lb-stage');
    var isCert = lbKind === 'certificates', file = item.file, isPdf = extOf(file) === 'pdf';
    stage.innerHTML = '<div class="lb-loading" role="status">Loading…</div>';
    var node;
    if (isPdf) {
      node = el('object', 'lb-pdf'); node.setAttribute('type', 'application/pdf'); node.setAttribute('data', file + '#view=FitH');
      node.setAttribute('aria-label', item.title);
      node.innerHTML = '<div class="cv-fallback"><p>This browser cannot show PDFs in the page.</p><p><a class="btn" href="' + file + '" target="_blank" rel="noopener noreferrer">Open the PDF</a></p></div>';
      node.addEventListener('load', function () { var l = stage.querySelector('.lb-loading'); if (l) l.remove(); });
      setTimeout(function () { var l = stage.querySelector('.lb-loading'); if (l) l.remove(); }, 2500);
    } else {
      node = el('img', 'lb-img'); node.alt = item.title; node.decoding = 'async';
      node.addEventListener('load', function () { var l = stage.querySelector('.lb-loading'); if (l) l.remove(); });
      node.addEventListener('error', function () {
        stage.innerHTML = '<div class="alert alert--err" role="alert">This file could not be loaded: <code>' + file.replace(/</g, '&lt;') + '</code></div>';
      });
      node.src = file;
    }
    stage.appendChild(node);
    document.getElementById('lb-cat').textContent = isCert ? (item.issuer || 'Certificate') : item.category;
    document.getElementById('lb-title').textContent = item.title;
    document.getElementById('lb-desc').textContent = isCert ? (item.date || '') : (item.description || '');
    var acts = document.getElementById('lb-actions');
    acts.innerHTML = '';
    if (!isCert) {
      var dl = el('a', 'btn btn--sm', 'Download image');
      dl.href = file; dl.setAttribute('download', item.downloadName || fname(item.title, file));
      acts.appendChild(dl);
    }
    if (!isCert && item.pdf) {
      var pd = el('a', 'btn btn--sm btn--ghost', 'Download PDF'); pd.href = item.pdf; pd.setAttribute('download', ''); acts.appendChild(pd);
    }
    var multi = lbItems.length > 1;
    lb.querySelector('.lb-prev').hidden = !multi; lb.querySelector('.lb-next').hidden = !multi;
    // preload neighbour
    if (multi && !isCert) { var n = new Image(); n.src = M[lbKind][lbItems[(lbIndex + 1) % lbItems.length]].file; }
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-lightbox]');
    if (t) { e.preventDefault(); openLb(t.getAttribute('data-lightbox'), +t.getAttribute('data-index'), t); }
  });

  /* ---------- Custom video player ---------- */
  function fmt(s) { if (!isFinite(s)) return '0:00'; var m = Math.floor(s / 60), r = Math.floor(s % 60); return m + ':' + (r < 10 ? '0' : '') + r; }
  function initPlayer(host) {
    var src = host.getAttribute('data-src'), poster = host.getAttribute('data-poster'), title = host.getAttribute('data-title'), webm = host.getAttribute('data-webm');
    host.classList.add('vp');
    host.innerHTML =
      '<video preload="metadata" playsinline' + (poster ? ' poster="' + poster + '"' : '') + ' aria-label="' + title.replace(/"/g, '&quot;') + '">' +
      '<source src="' + src + '" type="video/mp4">' + (webm ? '<source src="' + webm + '" type="video/webm">' : '') + 'Your browser does not support MP4 video.</video>' +
      '<div class="vp-msg" role="status" hidden></div>' +
      '<button class="vp-big" type="button" aria-label="Play video">▶</button>' +
      '<div class="vp-bar">' +
      '<button class="vp-btn vp-play" type="button" aria-label="Play">▶</button>' +
      '<span class="vp-time vp-cur">0:00</span>' +
      '<input class="vp-seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek">' +
      '<span class="vp-time vp-dur">0:00</span>' +
      '<button class="vp-btn vp-mute" type="button" aria-label="Mute">🔊</button>' +
      '<input class="vp-vol" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volume">' +
      '<button class="vp-btn vp-fs" type="button" aria-label="Fullscreen">⛶</button></div>';
    var v = host.querySelector('video'), big = host.querySelector('.vp-big'), play = host.querySelector('.vp-play'),
      seek = host.querySelector('.vp-seek'), cur = host.querySelector('.vp-cur'), dur = host.querySelector('.vp-dur'),
      mute = host.querySelector('.vp-mute'), vol = host.querySelector('.vp-vol'), fs = host.querySelector('.vp-fs'), msg = host.querySelector('.vp-msg');
    function toggle() { if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }
    big.addEventListener('click', toggle); play.addEventListener('click', toggle); v.addEventListener('click', toggle);
    v.addEventListener('play', function () { host.classList.add('is-playing'); play.textContent = '❚❚'; play.setAttribute('aria-label', 'Pause'); big.hidden = true; });
    v.addEventListener('pause', function () { host.classList.remove('is-playing'); play.textContent = '▶'; play.setAttribute('aria-label', 'Play'); big.hidden = false; });
    v.addEventListener('ended', function () { big.hidden = false; });
    v.addEventListener('loadedmetadata', function () { dur.textContent = fmt(v.duration); });
    v.addEventListener('timeupdate', function () {
      cur.textContent = fmt(v.currentTime);
      if (v.duration) seek.value = Math.round(v.currentTime / v.duration * 1000);
    });
    seek.addEventListener('input', function () { if (v.duration) v.currentTime = seek.value / 1000 * v.duration; });
    vol.addEventListener('input', function () { v.volume = +vol.value; v.muted = v.volume === 0; });
    mute.addEventListener('click', function () { v.muted = !v.muted; });
    v.addEventListener('volumechange', function () {
      mute.textContent = (v.muted || v.volume === 0) ? '🔇' : '🔊';
      mute.setAttribute('aria-label', v.muted ? 'Unmute' : 'Mute');
      vol.value = v.muted ? 0 : v.volume;
    });
    fs.addEventListener('click', function () {
      var d = document;
      if (d.fullscreenElement || d.webkitFullscreenElement) { (d.exitFullscreen || d.webkitExitFullscreen).call(d); return; }
      var t = host.requestFullscreen ? host : null;
      if (t) t.requestFullscreen(); else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iOS Safari
    });
    host.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); toggle(); }
      else if (e.key === 'ArrowRight') v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
      else if (e.key === 'ArrowLeft') v.currentTime = Math.max(0, v.currentTime - 5);
      else if (e.key.toLowerCase() === 'm') v.muted = !v.muted;
      else if (e.key.toLowerCase() === 'f') fs.click();
    });
    function fail() {
      host.classList.add('is-error'); big.hidden = true; msg.hidden = false;
      msg.innerHTML = 'This video could not be loaded (<code>' + src + '</code>). <a href="' + src + '" target="_blank" rel="noopener noreferrer">Try opening it directly</a>.';
    }
    v.addEventListener('error', fail);
    var srcs = host.querySelectorAll('source'); srcs[srcs.length - 1].addEventListener('error', fail); // fail only when the last fallback also fails
    // pause other players when one starts
    v.addEventListener('play', function () {
      [].forEach.call(document.querySelectorAll('.vp video'), function (o) { if (o !== v) o.pause(); });
    });
  }
  [].forEach.call(document.querySelectorAll('[data-vp]'), initPlayer);

  /* ---------- Missing-file guards ---------- */
  // Home page "Download CV" must never silently fail: if the CV is missing, send visitors to the CV page, which explains it.
  var cvLinks = [].slice.call(document.querySelectorAll('[data-cv="download"]'));
  if (cvLinks.length && document.body.getAttribute('data-page') !== 'cv' && location.protocol !== 'file:' && M.cv && M.cv.file) {
    fetch(M.cv.file, { method: 'HEAD' }).then(function (r) {
      if (!r.ok) cvLinks.forEach(function (a) { a.removeAttribute('download'); a.href = 'cv.html'; a.textContent = 'CV'; });
    }).catch(function () {});
  }
  // Certificate downloads: tell the visitor if the file is gone rather than saving an error page.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-file-check]');
    if (!a || location.protocol === 'file:') return;
    e.preventDefault();
    fetch(a.getAttribute('href'), { method: 'HEAD' }).then(function (r) {
      if (!r.ok) throw new Error('missing');
      var tmp = document.createElement('a'); tmp.href = a.href; tmp.download = a.getAttribute('download') || ''; document.body.appendChild(tmp); tmp.click(); tmp.remove();
    }).catch(function () { alert('Sorry, this certificate file could not be found on the server.'); });
  });
})();
/* Pages are built by JS, so jump to #graphics / #videos once the DOM exists. */
(function () {
  var h = location.hash && document.getElementById(location.hash.slice(1));
  if (h) setTimeout(function () { h.scrollIntoView(); }, 50);
})();
