/* Bruce Lee 個人網站 — 原生 JS，無框架、無 build */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 年份 ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Email：分段組裝，降低被爬蟲直接掃走的機率 ---------- */
  var user = 'brucelee', host = 'eat2die', tld = 'com';
  var addr = user + '@' + host + '.' + tld;
  Array.prototype.forEach.call(document.querySelectorAll('[data-mail]'), function (el) {
    el.href = 'mai' + 'lto:' + addr + '?subject=' +
      encodeURIComponent('網站專案洽詢');
    el.setAttribute('aria-label', '寄信給 ' + addr);
  });

  /* ---------- nav 滾動後上底色 ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('stuck', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 進場動畫 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (n) {
          return n.classList && n.classList.contains('reveal');
        });
        var i = sibs.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 6) * 80 : 0) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
  }

  /* ---------- 數字跑動 ---------- */
  var counters = document.querySelectorAll('.count');
  var runCount = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduced) { el.textContent = target; return; }
    var dur = 1400, t0 = null;
    var step = function (t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
  } else {
    Array.prototype.forEach.call(counters, runCount);
  }

  if (reduced) return; /* 以下都是純視覺效果 */

  /* ---------- 游標光暈 ---------- */
  var spot = document.querySelector('.spotlight');
  var sx = 0, sy = 0, cx = 0, cy = 0, cursorOn = false;
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    sx = e.clientX; sy = e.clientY;
    if (!cursorOn) { cursorOn = true; cx = sx; cy = sy; document.body.classList.add('has-cursor'); }
  }, { passive: true });
  var spotLoop = function () {
    cx += (sx - cx) * 0.09;
    cy += (sy - cy) * 0.09;
    if (spot) spot.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
    requestAnimationFrame(spotLoop);
  };
  requestAnimationFrame(spotLoop);

  /* ---------- 卡片內的光暈跟著滑鼠 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.card'), function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  });

  /* ---------- 磁吸按鈕 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.magnetic'), function (btn) {
    btn.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = btn.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      btn.style.transform = 'translate(' + (dx * 14).toFixed(2) + 'px,' + (dy * 10 - 2).toFixed(2) + 'px)';
    }, { passive: true });
    btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
  });

  /* ---------- 背景網格 canvas ---------- */
  var cv = document.getElementById('bg-grid');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var w = 0, h = 0, dpr = 1, gap = 46, t = 0;

  var resize = function () {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = Math.floor(w * dpr);
    cv.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt); rt = setTimeout(resize, 150);
  });

  var draw = function () {
    t += 0.004;
    ctx.clearRect(0, 0, w, h);

    /* 網格線 */
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.038)';
    ctx.beginPath();
    for (var x = (t * 18) % gap; x < w; x += gap) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (var yy = 0; yy < h; yy += gap) { ctx.moveTo(0, yy); ctx.lineTo(w, yy); }
    ctx.stroke();

    /* 交點微光：跟著滑鼠亮起來 */
    var range = 190;
    for (var gx = 0; gx < w; gx += gap) {
      for (var gy = 0; gy < h; gy += gap) {
        var d = Math.hypot(gx - cx, gy - cy);
        if (d > range) continue;
        var a = (1 - d / range) * 0.5;
        ctx.fillStyle = 'rgba(126,228,195,' + a.toFixed(3) + ')';
        ctx.fillRect(gx - 1, gy - 1, 2.4, 2.4);
      }
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();
