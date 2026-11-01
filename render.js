/* Builds every page from js/data.js (replaces the Blade views + Laravel controllers).
   Loaded after data.js and before site.js, so site.js finds the finished DOM. */
(function () {
  'use strict';

  var D = window.PORTFOLIO;
  var P = D.profile;
  var M = window.PORTFOLIO_MEDIA || { graphicCategories: [], graphics: [], videos: [], certificates: [], cv: { file: 'assets/documents/cv.pdf', downloadName: 'CV.pdf' } };
  var CV_FILE = (M.cv && M.cv.file) || 'assets/documents/cv.pdf';
  var CV_NAME = (M.cv && M.cv.downloadName) || 'CV.pdf';
  var page = document.body.getAttribute('data-page');
  var qs = new URLSearchParams(location.search);

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function firstChar(s) { return Array.from(String(s))[0] || ''; }
  function telHref(phone) { return 'tel:' + String(phone).replace(/[^+\d]/g, ''); }
  function slugClass(s) { return String(s).toLowerCase().replace(/ /g, '-'); }
  function projectUrl(slug) { return 'project.html?slug=' + encodeURIComponent(slug); }
  function ext(href, label, cls) {
    return '<a class="' + cls + '" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
  }

  var NAV = [
    ['home', 'index.html', 'Home'], ['about', 'about.html', 'About'], ['skills', 'skills.html', 'Skills'],
    ['experience', 'experience.html', 'Experience'], ['projects', 'projects.html', 'Projects'],
    ['education', 'education.html', 'Education'], ['cv', 'cv.html', 'CV'], ['contact', 'contact.html', 'Contact']
  ];
  var LEVELS = { 1: 'Beginner', 2: 'Basic', 3: 'Working', 4: 'Proficient', 5: 'Advanced' };

  function sortedProjects() { // newest first, then by id
    return D.projects.slice().sort(function (a, b) {
      return b.year !== a.year ? b.year - a.year : b.id - a.id;
    });
  }

  /* Image fallbacks (replaces PHP file_exists checks): a missing image becomes the neutral placeholder. */
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (!t || t.tagName !== 'IMG') return;
    var ph = t.getAttribute('data-ph');
    if (ph === 'project' || ph === 'photo') {
      var d = document.createElement('div');
      var letter = t.getAttribute('data-letter') || '';
      if (ph === 'project') {
        d.className = 'ph'; d.setAttribute('aria-hidden', 'true');
      } else {
        d.className = 'photo-ph'; d.setAttribute('role', 'img'); d.setAttribute('aria-label', 'Profile photo placeholder');
      }
      d.textContent = letter;
      t.replaceWith(d);
    } else if (ph === 'remove') {
      t.remove();
    }
  }, true);

  /* ---------- shared pieces ---------- */
  function headerHtml(active) {
    var links = NAV.map(function (n) {
      var cur = (n[0] === active || (n[0] === 'projects' && active === 'project')) ? ' aria-current="page"' : '';
      return '<li><a href="' + n[1] + '"' + cur + '>' + n[2] + '</a></li>';
    }).join('');
    return '<div class="container nav">' +
      '<a class="brand" href="index.html" aria-label="' + esc(P.name) + ' home">' + esc(P.nickname) + '<span>.</span></a>' +
      '<nav aria-label="Main"><ul class="nav-links" id="nav-links">' + links + '</ul></nav>' +
      '<div class="nav-tools">' +
      '<button class="icon-btn" id="theme-toggle" type="button" aria-pressed="false" aria-label="Switch to dark mode">🌙</button>' +
      '<button class="icon-btn nav-toggle" id="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Menu">☰</button>' +
      '</div></div>';
  }

  function footerHtml() {
    var s = P.socials || {};
    return '<div class="container"><div class="footer-grid">' +
      '<div><h2>' + esc(P.name) + '</h2><p class="muted">' + esc(P.title) + '</p><ul>' +
      '<li><a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a></li>' +
      (s.linkedin ? '<li>' + ext(s.linkedin, 'LinkedIn', '') + '</li>' : '') +
      (s.github ? '<li>' + ext(s.github, 'GitHub', '') + '</li>' : '') +
      '</ul></div>' +
      '<nav aria-label="Footer"><h2>Pages</h2><ul>' +
      '<li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li>' +
      '<li><a href="skills.html">Skills</a></li><li><a href="experience.html">Experience</a></li></ul></nav>' +
      '<nav aria-label="Footer more"><h2>More</h2><ul>' +
      '<li><a href="projects.html">Projects</a></li><li><a href="education.html">Education</a></li>' +
      '<li><a href="cv.html">CV</a></li><li><a href="contact.html">Contact</a></li></ul></nav>' +
      '</div><p class="copyright">© ' + new Date().getFullYear() + ' ' + esc(P.name) + '. All rights reserved.</p></div>';
  }

  function projectCard(p) {
    var search = [p.name, p.category, p.type, String(p.year), p.description].concat(p.technologies).join(' ').toLowerCase();
    var thumb = p.image
      ? '<img src="' + esc(p.image) + '" alt="Screenshot of ' + esc(p.name) + '" width="640" height="360" loading="lazy" decoding="async" data-ph="project" data-letter="' + esc(firstChar(p.name)) + '">'
      : '<div class="ph" aria-hidden="true">' + esc(firstChar(p.name)) + '</div>';
    return '<article class="card project-card" data-project' +
      ' data-search="' + esc(search) + '"' +
      ' data-category="' + esc(p.category) + '"' +
      ' data-year="' + esc(p.year) + '"' +
      ' data-type="' + esc(p.type) + '"' +
      ' data-tech="' + esc(p.technologies.join('|')) + '">' +
      '<div class="project-thumb">' + thumb + '</div>' +
      '<div class="card-body"><div class="meta"><span>' + esc(p.category) + '</span><span>' + esc(p.year) + '</span>' +
      '<span class="status status--' + esc(slugClass(p.status)) + '">' + esc(p.status) + '</span></div>' +
      '<h3><a href="' + projectUrl(p.slug) + '">' + esc(p.name) + '</a></h3>' +
      '<p>' + esc(p.description) + '</p>' +
      '<p class="meta">Role: ' + esc(p.role) + '</p>' +
      '<ul class="chips" aria-label="Technologies used">' +
      p.technologies.map(function (t) { return '<li class="chip">' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<div class="card-actions"><a class="btn btn--sm" href="' + projectUrl(p.slug) + '">View project</a>' +
      (p.github ? ext(p.github, 'Source code', 'btn btn--sm btn--ghost') : '') +
      (p.url ? ext(p.url, 'Demo', 'btn btn--sm btn--ghost') : '') +
      '</div></div></article>';
  }


  /* ---------- media cards (graphics / videos / certificates) ---------- */
  function extOf(f) { var m = /\.([a-z0-9]+)(?:[?#].*)?$/i.exec(String(f || '')); return m ? m[1].toLowerCase() : ''; }
  function graphicCard(g, i) {
    return '<figure class="g-card" data-graphic data-category="' + esc(g.category) + '" data-search="' +
      esc([g.title, g.category, g.description, g.year].join(' ').toLowerCase()) + '" data-index="' + M.graphics.indexOf(g) + '">' +
      '<button type="button" class="g-open" data-lightbox="graphics" data-index="' + M.graphics.indexOf(g) + '" aria-label="Preview ' + esc(g.title) + '">' +
      '<img src="' + esc(g.file) + '" alt="' + esc(g.title) + '" loading="lazy" decoding="async" data-ph="project" data-letter="' + esc(firstChar(g.title)) + '">' +
      '<span class="g-zoom" aria-hidden="true">⤢</span></button>' +
      '<figcaption><span class="g-cat">' + esc(g.category) + '</span><strong>' + esc(g.title) + '</strong>' +
      '<span class="g-desc">' + esc(g.description || '') + '</span></figcaption></figure>';
  }
  function certCard(c) {
    var isPdf = extOf(c.file) === 'pdf';
    var thumb = c.thumb || (!isPdf ? c.file : '');
    var inner = thumb
      ? '<img src="' + esc(thumb) + '" alt="Certificate: ' + esc(c.title) + '" loading="lazy" decoding="async" data-ph="project" data-letter="' + esc(firstChar(c.title)) + '">'
      : '<div class="ph pdf-ph" aria-hidden="true"><span>PDF</span></div>';
    var idx = M.certificates.indexOf(c);
    return '<article class="card cert-card"><button type="button" class="cert-thumb" data-lightbox="certificates" data-index="' + idx +
      '" aria-label="Preview ' + esc(c.title) + '">' + inner + '<span class="g-zoom" aria-hidden="true">⤢</span></button>' +
      '<div class="card-body"><h3>' + esc(c.title) + '</h3>' +
      (c.issuer ? '<p class="muted" style="margin:0">Issued by ' + esc(c.issuer) + '</p>' : '') +
      (c.date ? '<p class="meta" style="margin:.35rem 0 0"><span>' + esc(c.date) + '</span></p>' : '') +
      '<div class="card-actions"><button type="button" class="btn btn--sm" data-lightbox="certificates" data-index="' + idx + '">View certificate</button>' +
      '</div></div></article>';
  }
  function videoCard(v, i) {
    return '<article class="card video-card" data-video-index="' + i + '">' +
      '<div class="vp" data-vp data-src="' + esc(v.file) + '" data-webm="' + esc(v.webm || '') + '" data-poster="' + esc(v.poster || '') + '" data-title="' + esc(v.title) + '"></div>' +
      '<div class="card-body"><h3>' + esc(v.title) + '</h3>' +
      (v.year ? '<p class="meta" style="margin:0 0 .4rem"><span>' + esc(v.year) + '</span></p>' : '') +
      '<p style="margin:0;color:var(--muted)">' + esc(v.description || '') + '</p></div></article>';
  }

  /* ---------- pages ---------- */
  var pages = {};

  pages.home = function () {
    var photo = P.photo
      ? '<img src="programming.gif" alt="Portrait of ' + esc(P.name) + '" width="340" height="425" decoding="async" data-ph="photo" data-letter="' + esc(firstChar(P.name)) + '">'
      : '<div class="photo-ph" role="img" aria-label="Profile photo placeholder">' + esc(firstChar(P.name)) + '</div>';
    return {
      title: '', description: P.intro,
      html:
        '<section class="hero" aria-labelledby="hero-title"><div class="container"><div>' +
        '<span class="hero-role">' + esc(P.title) + '</span>' +
        '<h1 id="hero-title">' + esc(P.name) + '</h1>' +
        '<p class="hero-tagline">' + esc(P.tagline) + '</p>' +
        '<p class="hero-intro">' + esc(P.intro) + '</p>' +
        '<div class="btn-row"><a class="btn" href="projects.html">View My Projects</a>' +
        '<a class="btn btn--ghost" href="' + esc(CV_FILE) + '" download="' + esc(CV_NAME) + '" data-cv="download">Download CV</a>' +
        '<a class="btn btn--ghost" href="contact.html">Contact Me</a></div></div>' +
        '<div class="photo-frame">' + photo + '</div></div></section>' +
        '<section class="section" aria-labelledby="featured-title"><div class="container">' +
        '<h2 id="featured-title">Recent projects</h2><div class="grid grid--3">' +
        sortedProjects().slice(0, 3).map(projectCard).join('') + '</div>' +
        '<div class="btn-row"><a class="btn btn--ghost" href="projects.html">See all projects</a></div></div></section>' 
    };
  };

  pages.about = function () {
    var deg = D.education.schools[0];
    return {
      title: 'About',
      description: 'Background, education, and areas of specialization of ' + P.name + '.',
      html:
        '<div class="page-head"><div class="container"><h1>About me</h1></div></div>' +
        '<section class="section"><div class="container two-col"><div><h2>Who I am</h2>' +
        P.bio.map(function (b) { return '<p>' + esc(b) + '</p>'; }).join('') + '</div>' +
        '<div class="card card-body"><h2>Basic information</h2><dl class="facts">' +
        '<dt>Full name</dt><dd>' + esc(P.name) + '</dd>' +
        '<dt>Nickname</dt><dd>' + esc(P.nickname) + '</dd>' +
        '<dt>Title</dt><dd>' + esc(P.title) + '</dd>' +
        '<dt>Location</dt><dd>' + esc(P.location) + '</dd>' +
        '<dt>Email</dt><dd><a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a></dd>' +
        (P.phone ? '<dt>Phone</dt><dd><a href="' + esc(telHref(P.phone)) + '">' + esc(P.phone) + '</a></dd>' : '') +
        (deg ? '<dt>Education</dt><dd>' + esc(deg.detail) + ', ' + esc(deg.school) + '</dd>' : '') +
        '<dt>Occupation</dt><dd>' + esc(P.occupation) + '</dd>' +
        '<dt>Experience</dt><dd>' + esc(P.experience_years) + ' years</dd>' +
        '<dt>Specialization</dt><dd>' + esc(P.specializations.join(', ')) + '</dd>' +
        '</dl></div></div></section>'
    };
  };

  pages.skills = function () {
    var groups = Object.keys(D.skills).map(function (g) {
      return '<div class="skill-group"><h2>' + esc(g) + '</h2><div class="grid grid--3">' +
        D.skills[g].map(function (s) {
          var dots = '';
          for (var i = 1; i <= 5; i++) dots += '<i class="' + (i <= s.level ? 'on' : '') + '"></i>';
          return '<div class="card skill-card"><div class="top"><span class="ico" aria-hidden="true">' + esc(s.icon) + '</span>' +
            '<strong>' + esc(s.name) + '</strong></div>' +
            '<div class="level" role="img" aria-label="' + esc(s.name) + ': ' + LEVELS[s.level] + ', level ' + s.level + ' of 5">' + dots + '</div>' +
            '<div class="level-label">' + LEVELS[s.level] + '</div></div>';
        }).join('') + '</div></div>';
    }).join('');
    return {
      title: 'Skills',
      description: 'Technical and professional skills in web development, databases, networking, and teamwork.',
      html:
        '<div class="page-head"><div class="container"><h1>Skills</h1>' +
        '<p>Levels are my own honest ratings from Beginner to Advanced, not percentages.</p></div></div>' +
        '<section class="section"><div class="container">' + groups + '</div></section>'
    };
  };

  pages.experience = function () {
    function list(items) { return '<ul>' + items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>'; }
    return {
      title: 'Experience',
      description: 'Professional and project experience timeline with responsibilities and accomplishments.',
      html:
        '<div class="page-head"><div class="container"><h1>Experience</h1></div></div>' +
        '<section class="section"><div class="container"><ol class="timeline">' +
        D.experience.map(function (j) {
          return '<li><div class="when">' + esc(j.dates || 'Creative work') + '</div>' +
            '<h2 style="font-size:1.35rem">' + esc(j.position) + '</h2>' +
            '<div class="org">' + esc(j.org) + ', ' + esc(j.location) + '</div>' +
            '<h3>Responsibilities</h3>' + list(j.responsibilities) +
            (j.accomplishments && j.accomplishments.length ? '<h3>Major accomplishments</h3>' + list(j.accomplishments) : '') +
            '</li>';
        }).join('') + '</ol></div></section>'
    };
  };

  pages.education = function () {
    var E = D.education;
    var certs = M.certificates.length
      ? '<section class="section section--tight" id="certificates"><div class="container"><h2>Certificates &amp; achievements</h2>' +
        '<p class="muted">Seminars, workshops, and online courses. Select a certificate to view it larger.</p>' +
        '<div class="grid grid--2">' + M.certificates.map(certCard).join('') + '</div></div></section>'
      : '';
    return {
      title: 'Education & Credentials',
      description: 'Schools attended and certificates earned.',
      html:
        '<div class="page-head"><div class="container"><h1>Education &amp; credentials</h1></div></div>' +
        '<section class="section"><div class="container"><h2>Education</h2><div class="grid grid--2">' +
        E.schools.map(function (d) {
          return '<div class="card card-body school"><img class="school-logo" src="' + esc(d.logo) + '" alt="' + esc(d.school) + ' logo" loading="lazy" width="72" height="72">' +
            '<div><p class="g-cat" style="margin:0">' + esc(d.level) + '</p><h3 style="margin:.15rem 0">' + esc(d.school) + '</h3>' +
            (d.detail ? '<p style="margin:0">' + esc(d.detail) + '</p>' : '') +
            '<p class="meta" style="margin:.4rem 0 0"><span>' + esc(d.status) + '</span></p></div></div>';
        }).join('') + '</div></div></section>' + certs
    };
  };

  pages.projects = function () {
    var list = sortedProjects();
    var years = Array.from(new Set(list.map(function (p) { return p.year; }))).sort(function (a, b) { return b - a; });
    var techs = Array.from(new Set([].concat.apply([], list.map(function (p) { return p.technologies; })))).sort();
    var types = Array.from(new Set(list.map(function (p) { return p.type; }))).sort();
    function opts(arr) { return arr.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + '</option>'; }).join(''); }
    function sel(id, label, arr) {
      return '<div class="field"><label for="' + id + '">' + label + '</label><select id="' + id + '"><option value="">All</option>' + opts(arr) + '</select></div>';
    }
    return {
      title: 'Projects',
      description: 'Previous digital projects: web development, information systems, databases, and design. Search by name, technology, category, year, or type.',
      html:
        '<div class="page-head"><div class="container"><h1>Projects</h1>' +
        '<p>Search by name, technology, category, year, or project type.</p></div></div>' +
        '<section class="section section--tight"><div class="container">' +
        '<form class="filters" id="filter-form" role="search" aria-label="Filter projects">' +
        '<div class="field"><label for="f-search">Search</label>' +
        '<input id="f-search" type="search" placeholder="e.g. Laravel, 2026, thesis" autocomplete="off"></div>' +
        sel('f-category', 'Category', D.categories) + sel('f-tech', 'Technology', techs) +
        sel('f-year', 'Year', years) + sel('f-type', 'Project type', types) + '</form>' +
        '<div class="btn-row" style="margin:0 0 1rem"><button class="btn btn--sm btn--ghost" type="button" id="f-clear">Clear filters</button></div>' +
        '<p class="result-count" id="result-count" role="status" aria-live="polite"></p>' +
        '<div class="grid grid--3" id="project-list">' + list.map(projectCard).join('') + '</div>' +
        '<div class="empty" id="no-results" hidden><p style="margin:0 auto">No projects match these filters. Clear a filter or try a different search term.</p></div>' +
        '</div></section>'
    };
  };

  pages.project = function () {
    var slug = qs.get('slug') || '';
    var p = null;
    D.projects.forEach(function (x) { if (x.slug === slug) p = x; });
    if (!p) {
      return {
        title: 'Project not found', description: 'This project does not exist.',
        html: '<div class="page-head"><div class="container"><p class="crumbs"><a href="projects.html">Projects</a> / Not found</p>' +
          '<h1>Project not found</h1></div></div>' +
          '<section class="section"><div class="container"><p>That project does not exist. <a href="projects.html">Back to all projects</a>.</p></div></section>'
      };
    }
    var hero = p.image
      ? '<img src="' + esc(p.image) + '" alt="Screenshot of ' + esc(p.name) + '" width="1120" height="630" decoding="async" data-ph="project" data-letter="' + esc(firstChar(p.name)) + '">'
      : '<div class="ph" aria-hidden="true">' + esc(firstChar(p.name)) + '</div>';
    var shots = (p.screenshots || []).length
      ? '<h2>Screenshots</h2><div class="shots">' + p.screenshots.map(function (s, i) {
          return '<img src="' + esc(s) + '" alt="' + esc(p.name) + ' screenshot ' + (i + 1) + '" width="560" height="350" loading="lazy" decoding="async" data-ph="remove">';
        }).join('') + '</div>'
      : '';
    var links = (p.url || p.github || p.docs)
      ? '<div class="btn-row">' +
        (p.url ? ext(p.url, 'Live website', 'btn btn--sm') : '') +
        (p.github ? ext(p.github, 'GitHub', 'btn btn--sm btn--ghost') : '') +
        (p.docs ? ext(p.docs, 'Documentation', 'btn btn--sm btn--ghost') : '') + '</div>'
      : '';
    return {
      title: p.name, description: p.description,
      html:
        '<div class="page-head"><div class="container"><p class="crumbs"><a href="projects.html">Projects</a> / ' + esc(p.name) + '</p>' +
        '<h1>' + esc(p.name) + '</h1><div class="meta"><span>' + esc(p.category) + '</span><span>' + esc(p.type) + '</span>' +
        '<span>' + esc(p.year) + '</span><span class="status status--' + esc(slugClass(p.status)) + '">' + esc(p.status) + '</span></div></div></div>' +
        '<section class="section"><div class="container">' +
        '<div class="detail-hero"><div class="project-thumb">' + hero + '</div></div>' +
        '<div class="detail-grid"><div>' +
        '<h2>Overview</h2><p>' + esc(p.description) + '</p>' +
        '<h2>Problem</h2><p>' + esc(p.problem) + '</p>' +
        '<h2>Solution</h2><p>' + esc(p.solution) + '</p>' +
        '<h2>Features</h2><ul>' + p.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
        shots + '</div>' +
        '<aside><div class="card card-body"><h2 style="font-size:1.2rem">Project facts</h2>' +
        '<dl class="facts" style="grid-template-columns:1fr"><dt>My role</dt><dd>' + esc(p.role) + '</dd>' +
        '<dt>Year</dt><dd>' + esc(p.year) + '</dd><dt>Status</dt><dd>' + esc(p.status) + '</dd></dl>' +
        '<h3 style="margin-top:1.25rem">Technologies used</h3><ul class="chips">' +
        p.technologies.map(function (t) { return '<li class="chip">' + esc(t) + '</li>'; }).join('') + '</ul>' +
        links + '</div></aside></div></div></section>' +
        (p.slug === GD_SLUG ? '<section class="section section--tight"><div class="container">' + graphicsBlock() + videosBlock() + '</div></section>' : '')
    };
  };

  /* Graphics + videos live inside the "Graphic Design Portfolio" project page. */
  var GD_SLUG = 'graphic-design-portfolio';
  function graphicsBlock() {
    var tabs = '<button type="button" class="tab is-active" data-filter="" aria-pressed="true">All <span>' + M.graphics.length + '</span></button>' +
      M.graphicCategories.map(function (c) {
        var n = M.graphics.filter(function (g) { return g.category === c; }).length;
        return '<button type="button" class="tab" data-filter="' + esc(c) + '" aria-pressed="false"' + (n ? '' : ' disabled') + '>' + esc(c) + ' <span>' + n + '</span></button>';
      }).join('');
    return '<section class="gd-block" id="graphics" aria-labelledby="gd-title"><h2 id="gd-title">Graphics design projects</h2>' +
      '<p class="muted">Posters, logos, branding, and social media designs. Select a piece to view it larger.</p>' +
      '<div class="tabs" id="g-tabs" role="group" aria-label="Filter by category">' + tabs + '</div>' +
      '<p class="result-count" id="g-count" role="status" aria-live="polite"></p>' +
      (M.graphics.length
        ? '<div class="gallery" id="g-list">' + M.graphics.map(graphicCard).join('') + '</div>'
        : '<div class="empty"><p style="margin:0 auto">No graphics have been added yet.</p></div>') +
      '<div class="empty" id="g-none" hidden><p style="margin:0 auto">Nothing in this category yet.</p></div></section>';
  }
  function videosBlock() {
    return '<section class="gd-block" id="videos" aria-labelledby="vd-title"><h2 id="vd-title">Video projects</h2>' +
      '<p class="muted">Watch directly on this page. No download needed.</p>' +
      (M.videos.length
        ? '<div class="grid grid--2">' + M.videos.map(videoCard).join('') + '</div>'
        : '<div class="empty"><p style="margin:0 auto">No videos have been added yet.</p></div>') + '</section>';
  }

  pages.certificates = function () {
    return {
      title: 'Certificates', description: 'Certificates and achievements with previews and downloads.',
      html:
        '<div class="page-head"><div class="container"><h1>Certificates &amp; achievements</h1>' +
        '<p>Select a certificate to preview it, or download the original file.</p></div></div>' +
        '<section class="section"><div class="container">' +
        (M.certificates.length
          ? '<div class="grid grid--3">' + M.certificates.map(certCard).join('') + '</div>'
          : '<div class="alert alert--err" role="status">No certificate files have been uploaded yet. Add PDF, PNG, JPG, or JPEG files to <code>assets/certificates/</code> and list them in <code>js/content.js</code> (or use <a href="admin.html">admin.html</a>). Nothing is shown here until then.</div>') +
        (D.education.certifications && D.education.certifications.length
          ? '<h2 style="margin-top:3rem">Listed credentials</h2><p class="muted">Credentials from the Education page. Files for these have not been uploaded.</p><div class="grid grid--2">' +
            D.education.certifications.map(function (c) {
              return '<div class="card card-body"><h3>' + esc(c.name) + '</h3><p class="muted" style="margin:0">Issued by ' + esc(c.issuer) + '</p>' +
                '<p class="meta" style="margin:.5rem 0 0"><span>' + esc(c.year) + '</span></p></div>';
            }).join('') + '</div>'
          : '') +
        '</div></section>'
    };
  };

  pages.cv = function () {
    return {
      title: 'CV', description: 'View or download the latest CV in PDF format.',
      html:
        '<div class="page-head"><div class="container"><h1>Curriculum vitae</h1><p>View the CV below or download the original PDF.</p></div></div>' +
        '<section class="section"><div class="container" id="cv-box"><p class="muted" role="status">Checking for the CV file…</p></div></section>'
    };
  };

  pages.contact = function () {
    return {
      title: 'Contact', description: 'Get in touch by email, phone, social media, or the contact form.',
      html:
        '<div class="page-head"><div class="container"><h1>Contact</h1><p>Send a message and I will reply by email.</p></div></div>' +
        '<section class="section"><div class="container two-col"><div id="contact-area"></div>' +
        '<div class="card card-body"><h2 style="font-size:1.3rem">Details</h2><dl class="facts">' +
        '<dt>Email</dt><dd><a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a></dd>' +
        (P.phone ? '<dt>Phone</dt><dd><a href="' + esc(telHref(P.phone)) + '">' + esc(P.phone) + '</a></dd>' : '') +
        '<dt>Location</dt><dd>' + esc(P.location) + '</dd>' +
        (P.socials.linkedin ? '<dt>LinkedIn</dt><dd>' + ext(P.socials.linkedin, 'Profile', '') + '</dd>' : '') +
        (P.socials.github ? '<dt>GitHub</dt><dd>' + ext(P.socials.github, 'Profile', '') + '</dd>' : '') +
        (P.socials.facebook ? '<dt>Facebook</dt><dd>' + ext(P.socials.facebook, 'Profile', '') + '</dd>' : '') +
        '</dl></div></div></section>'
    };
  };

  /* ---------- SEO: title, description, canonical, Open Graph, JSON-LD ---------- */
  function setMeta(attr, key, value) {
    var el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', value);
  }
  function applySeo(pageTitle, desc) {
    var fullTitle = pageTitle ? pageTitle + ' | ' + P.name : P.name + ' | IT Professional Portfolio';
    var siteBase = D.siteUrl ? String(D.siteUrl).replace(/\/?$/, '/') : new URL('./', location.href).href;
    var file = location.pathname.split('/').pop();
    if (file === 'index.html') file = '';
    var canonical = new URL(file + (page === 'project' ? location.search : ''), siteBase).href;
    var og = new URL('img/og-image.png', siteBase).href;
    var photo = new URL(P.photo, siteBase).href;

    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setMeta('name', 'keywords', 'IT portfolio, web developer, Laravel developer, PHP, MySQL, information technology student, Calamba, Philippines');
    setMeta('name', 'author', P.name);
    var link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;

    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', P.name);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', og);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', og);

    // og-image.png is optional: fall back to the profile photo when it is missing.
    var probe = new Image();
    probe.onerror = function () { setMeta('property', 'og:image', photo); setMeta('name', 'twitter:image', photo); };
    probe.src = og;

    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Person',
      name: P.name, jobTitle: P.title, url: siteBase,
      address: { '@type': 'PostalAddress', addressLocality: P.location },
      sameAs: Object.keys(P.socials).map(function (k) { return P.socials[k]; }).filter(Boolean)
    }).replace(/</g, '\\u003c');
    document.head.appendChild(ld);
  }

  /* ---------- CV: download / view + optional tracking ---------- */
  function deviceOf(ua) {
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    return /mobile|android|iphone/i.test(ua) ? 'mobile' : 'desktop';
  }
  function trackCv(action) {
    if (!D.cvTrackEndpoint) return;
    try {
      var data = JSON.stringify({
        action: action, device: deviceOf(navigator.userAgent),
        referrer: (document.referrer || '').slice(0, 255), at: new Date().toISOString()
      });
      if (navigator.sendBeacon) navigator.sendBeacon(D.cvTrackEndpoint, data);
      else fetch(D.cvTrackEndpoint, { method: 'POST', body: data, keepalive: true });
    } catch (e) { /* never block the visitor from getting the CV */ }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-cv]') : null;
    if (a) trackCv(a.getAttribute('data-cv'));
  });

  function initCv() {
    var box = document.getElementById('cv-box');
    var file = CV_FILE;
    function actions(showView) {
      return '<div class="btn-row" style="margin-top:0">' +
        '<a class="btn" href="' + esc(file) + '" download="' + esc(CV_NAME) + '" data-cv="download">Download CV</a>' +
        (showView ? '<button class="btn btn--ghost" type="button" id="cv-view" aria-expanded="true" aria-controls="cv-viewer">Hide CV preview</button>' : '') +
        '<a class="btn btn--ghost" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer" data-cv="view">Open in new tab</a></div>';
    }
    function ok() {
      box.innerHTML = actions(true) +
        '<div class="cv-viewer" id="cv-viewer"><div class="cv-status" id="cv-status" role="status">Loading CV…</div>' +
        '<object class="cv-frame" id="cv-object" data="' + esc(file) + '#view=FitH" type="application/pdf" aria-label="CV preview">' +
        '<div class="cv-fallback"><p>Your browser cannot show PDFs inside the page (common on phones).</p>' +
        '<p><a class="btn" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer" data-cv="view">Open the CV</a> ' +
        '<a class="btn btn--ghost" href="' + esc(file) + '" download="' + esc(CV_NAME) + '" data-cv="download">Download CV</a></p></div></object></div>';
      var obj = document.getElementById('cv-object'), st = document.getElementById('cv-status');
      obj.addEventListener('load', function () { st.hidden = true; });
      setTimeout(function () { st.hidden = true; }, 4000);   // some browsers never fire load for PDFs
      var vb = document.getElementById('cv-view'), vw = document.getElementById('cv-viewer');
      vb.addEventListener('click', function () {
        var hide = !vw.hidden; vw.hidden = hide;
        vb.textContent = hide ? 'View CV' : 'Hide CV preview';
        vb.setAttribute('aria-expanded', hide ? 'false' : 'true');
        if (!hide) vw.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    function missing() {
      window.__cvMissing = true;
      box.innerHTML = '<div class="alert alert--err" role="alert"><strong>The CV file could not be loaded.</strong> ' +
        'No PDF was found at <code>' + esc(file) + '</code>. Upload your CV as that file (or change <code>cv.file</code> in <code>js/content.js</code>) and reload this page.</div>' +
        '<div class="btn-row"><a class="btn btn--ghost" href="contact.html">Contact me for my CV</a></div>';
    }
    if (location.protocol === 'file:') { ok(); return; } // browsers block the existence check on file://
    fetch(file, { method: 'HEAD' })
      .then(function (r) { if (r.ok) ok(); else missing(); })
      .catch(missing);
  }

  /* ---------- Contact form ---------- */
  function initContact() {
    var area = document.getElementById('contact-area');
    var renderedAt = Date.now();      // timing check (replaces the encrypted token)
    var LOG_KEY = 'portfolio-contact-log';

    function field(id, label, type, old, err, max, extra) {
      var input = type === 'textarea'
        ? '<textarea id="' + id + '" name="' + id + '" required maxlength="' + max + '"' + (err ? ' aria-invalid="true" aria-describedby="' + id + '-err"' : '') + '>' + esc(old) + '</textarea>'
        : '<input id="' + id + '" name="' + id + '" type="' + type + '" value="' + esc(old) + '" required maxlength="' + max + '"' + (extra || '') + (err ? ' aria-invalid="true" aria-describedby="' + id + '-err"' : '') + '>';
      return '<div class="field"><label for="' + id + '">' + label + '</label>' + input +
        (err ? '<div class="field-error" id="' + id + '-err">' + esc(err) + '</div>' : '') + '</div>';
    }

    function draw(old, errors, notice) {
      old = old || {}; errors = errors || {};
      var hasErr = Object.keys(errors).length > 0;
      area.innerHTML =
        (notice ? '<div class="alert alert--ok" role="status">' + esc(notice) + '</div>' : '') +
        (hasErr ? '<div class="alert alert--err" role="alert">' + esc(errors._general || 'Your message was not sent. Check the fields marked below and try again.') + '</div>' : '') +
        '<form class="form-stack" id="contact-form" novalidate>' +
        '<div class="hp" aria-hidden="true"><label for="website">Leave this field empty</label>' +
        '<input id="website" type="text" name="website" tabindex="-1" autocomplete="off"></div>' +
        field('name', 'Name', 'text', old.name, errors.name, 100, ' autocomplete="name"') +
        field('email', 'Email', 'email', old.email, errors.email, 150, ' autocomplete="email"') +
        field('subject', 'Subject', 'text', old.subject, errors.subject, 150, '') +
        field('message', 'Message', 'textarea', old.message, errors.message, 3000) +
        '<div><button class="btn" type="submit">Send message</button></div></form>';
      if (hasErr) {
        var bad = area.querySelector('[aria-invalid="true"]');
        if (bad) bad.focus();
      }
    }

    function stripTags(s) { return String(s).replace(/<[^>]*>/g, ''); }

    function validate(v) {
      var e = {};
      if (!v.name) e.name = 'The name field is required.';
      else if (v.name.length < 2) e.name = 'The name field must be at least 2 characters.';
      if (!v.email) e.email = 'The email field is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'The email field must be a valid email address.';
      if (!v.subject) e.subject = 'The subject field is required.';
      else if (v.subject.length < 3) e.subject = 'The subject field must be at least 3 characters.';
      if (!v.message) e.message = 'The message field is required.';
      else if (v.message.length < 10) e.message = 'The message field must be at least 10 characters.';
      return e;
    }

    function recentCount() { // limit: 5 messages per 10 minutes per visitor
      try {
        var now = Date.now();
        var log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]').filter(function (t) { return now - t < 600000; });
        return log;
      } catch (e) { return []; }
    }
    function remember(log) {
      try { log.push(Date.now()); localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch (e) { /* storage blocked */ }
    }

    function deliver(v) {
      var C = D.contact || {};
      if (!C.endpoint) { // no form service configured: open the visitor's email app
        location.href = 'mailto:' + P.email + '?subject=' + encodeURIComponent('[Portfolio] ' + v.subject) +
          '&body=' + encodeURIComponent('From: ' + v.name + ' <' + v.email + '>\n\n' + v.message);
        return Promise.resolve('mailto');
      }
      var payload = Object.assign({}, C.extraFields || {}, {
        name: v.name, email: v.email, subject: '[Portfolio] ' + v.subject, message: v.message
      });
      return fetch(C.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) { if (!r.ok) throw new Error('send failed'); return 'sent'; });
    }

    area.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = ev.target;
      var raw = {
        name: f.elements['name'].value, email: f.elements['email'].value, subject: f.elements['subject'].value, message: f.elements['message'].value
      };
      var v = {
        name: stripTags(raw.name).trim(), email: raw.email.trim(),
        subject: stripTags(raw.subject).trim(), message: stripTags(raw.message).trim()
      };
      var errors = validate(v);

      if (f.elements['website'].value !== '') errors.website = 'Invalid submission.';           // honeypot
      var elapsed = (Date.now() - renderedAt) / 1000;
      if (!Object.keys(errors).length && (elapsed < 3 || elapsed > 7200)) {         // timing check
        errors.message = 'Please reload the page and try sending your message again.';
      }
      if (Object.keys(errors).length) { draw(raw, errors); return; }

      var log = recentCount();
      if (log.length >= 5) {
        draw(raw, { _general: 'Too many messages. Please wait a few minutes and try again.', message: 'Too many messages. Please wait a few minutes and try again.' });
        return;
      }

      var btn = f.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending…';

      deliver(v).then(function (mode) {
        remember(log);
        renderedAt = Date.now();
        draw({}, {}, mode === 'mailto'
          ? 'Your email app should open with the message ready. Press send there to finish.'
          : 'Thank you! Your message was sent.');
      }).catch(function () {
        draw(raw, { _general: 'Your message could not be sent right now. Please try again, or email me directly.', message: 'Sending failed. Please try again.' });
      });
    });

    draw();
  }

  /* ---------- go ---------- */
  var def = (pages[page] || pages.home)();
  document.getElementById('site-header').innerHTML = headerHtml(page);
  document.getElementById('main').innerHTML = def.html;
  document.getElementById('site-footer').innerHTML = footerHtml();
  applySeo(def.title, def.description);

  if (page === 'projects') {
    document.getElementById('filter-form').addEventListener('submit', function (e) { e.preventDefault(); });
  }
  if (page === 'cv') initCv();
  if (page === 'contact') initContact();
})();
