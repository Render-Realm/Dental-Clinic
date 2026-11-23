/* MOTION.JS — scroll reveal, text reveal, hover helpers. Reduced-motion users par band rehta hai. */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];


  // 0) GSAP ScrollSmoother (CDN se load hota hai; na mile to normal scroll chalta hai)
  let smoother = null;
  if (window.gsap && window.ScrollTrigger && window.ScrollSmoother) {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    const w = document.createElement('div'), c = document.createElement('div');
    w.id = 'smooth-wrapper'; c.id = 'smooth-content';
    [...document.body.childNodes].forEach(n => { if (n.nodeName !== 'SCRIPT' && !(n.classList && ['wa-float', 'm-mh', 'm-menu'].some(k => n.classList.contains(k)))) c.appendChild(n); });
    w.appendChild(c); document.body.insertBefore(w, document.body.firstChild);
    document.documentElement.classList.add('m-smooth');
    smoother = ScrollSmoother.create({ wrapper: w, content: c, smooth: 1.3, effects: true }); window.__smoother = smoother;
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const id = a.getAttribute('href').slice(1), t = id && document.getElementById(id);
      e.preventDefault(); smoother.scrollTo(t || 0, true, 'top 20px');
    });
  }

  // 1) Scroll progress
  const bar = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'm-progress' }));

  // 2) Nav entrance
  const nav = document.querySelector('nav');
  if (nav) { const p = nav.parentElement; (p.tagName === 'HEADER' || p.children.length <= 3 ? p : nav).classList.add('m-nav-in'); }

  // 3) Text reveal: headings ke words
  let n;
  const split = el => {
    n = 0;
    const walk = node => [...node.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) return f.append(w);
          const o = document.createElement('span'), i = document.createElement('span');
          o.className = 'm-w'; i.className = 'm-wi'; i.textContent = w; i.style.setProperty('--i', n++); o.append(i); f.append(o);
        });
        c.replaceWith(f);
      } else if (c.nodeType === 1 && !['BR', 'svg'].includes(c.tagName)) walk(c);
    });
    walk(el); el.classList.add('m-split');
  };
  const heads = $$('h1,h2');
  heads.forEach(split);

  // 3b) Element reveal
  const sel = 'p,h3,footer>div';
  const items = $$(sel).filter(el => !el.closest('[data-svc-track]') || el.hasAttribute('data-svc-track'))
    .filter(el => !el.closest('.team-row') || el.classList.contains('team-row'))
    .filter(el => !el.closest('[data-t-card]') && !el.closest('[data-faq-answer]') && !el.closest('h1,h2') && !el.hasAttribute('data-t-card'));
  items.forEach(el => {
    el.classList.add('m-reveal');
    const sib = [...el.parentElement.children].filter(c => items.includes(c));
    el.style.setProperty('--d', Math.min(sib.indexOf(el), 5) * 90 + 'ms');
  });

  // 3c) Card reveal (mask wipe)
  const masks = [];
  $$('div,article,form,img,[data-svc-track],.team-row').forEach(el => {
    if (el.closest('footer,nav,header,[data-t-card],h1,h2')) return;
    const par = el.parentElement; if (par && par.closest('[data-m],[data-svc-track],.team-row')) return;
    const row = el.matches('[data-svc-track],.team-row'), cs = getComputedStyle(el);
    const r = parseFloat(cs.borderTopLeftRadius) || 0, w = el.offsetWidth, h = el.offsetHeight;
    if (!row && (r < 12 || r > 64 || w < 180 || w > 1100 || h < 100 || h > 1000 || cs.position === 'fixed')) return;
    el.dataset.m = ''; el.classList.add('m-mask'); el.style.setProperty('--r', (row ? 0 : r) + 'px'); masks.push(el);
  });
  masks.forEach(el => {
    const sib = masks.filter(m => m.parentElement === el.parentElement);
    el.style.setProperty('--d', Math.min(sib.indexOf(el), 4) * 120 + 'ms');
    el.addEventListener('transitionend', e => { if (e.target === el && e.propertyName === 'clip-path') el.classList.add('m-done'); });
  });
  // Reveal trigger: getBoundingClientRect se (clip-path wale elements IntersectionObserver se detect nahi hote)
  let pend = [...heads, ...items, ...masks];
  const reveal = () => {
    const vh = innerHeight * 0.94;
    pend = pend.filter(el => { if (el.getBoundingClientRect().top < vh) { el.classList.add('m-in'); return false; } return true; });
  };
  if (smoother) gsap.ticker.add(() => { if (pend.length) reveal(); });

  // 4) Floating glass cards + hero photo drift
  $$('div').forEach((el, k) => {
    const cs = getComputedStyle(el), bf = cs.backdropFilter || cs.webkitBackdropFilter;
    if (bf && bf !== 'none' && el.offsetWidth < 520 && el.offsetWidth > 80 && !el.closest('.m-float,footer,nav,.m-mh,.m-menu,.wa-float')) { el.classList.add('m-float'); el.style.setProperty('--fd', (k % 5) * -1.2 + 's'); }
  });
  $$('img').forEach(img => {
    const p = img.parentElement;
    if (img.closest('article,.team-card,.tour-grid,footer') || !p) return;
    if (getComputedStyle(p).overflow === 'hidden' && img.offsetWidth > 320 && getComputedStyle(img).position === 'absolute') img.classList.add('m-kb');
  });

  // 5) Buttons + nav links
  $$('a,button').forEach(el => {
    const cs = getComputedStyle(el), r = parseFloat(cs.borderTopLeftRadius);
    if (r >= 30 && el.offsetWidth > 36 && !el.closest('footer form input')) {
      el.classList.add('m-btn');
    } else if (el.closest('nav') && !el.closest('.m-menu') && el.tagName === 'A' && el.textContent.trim() && !el.querySelector('svg')) el.classList.add('m-link');
  });

  // 6) Scroll: progress bar + watermark drift
  const marks = $$('[aria-hidden="true"]').filter(el => parseFloat(getComputedStyle(el).fontSize) >= 100);
  let tick = false;
  const onScroll = () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      marks.forEach(m => { const b = m.getBoundingClientRect(), x = Math.max(-140, Math.min(140, (b.top - innerHeight / 2) * -.18)); m.style.translate = x + 'px 0'; });
      reveal(); tick = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', reveal); addEventListener('load', reveal); onScroll();

  // 7) Page leave transition
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target || /^(mailto:|tel:|#|http)/.test(a.getAttribute('href')) || !/\.html/.test(a.getAttribute('href'))) return;
    e.preventDefault(); document.body.classList.add('m-leaving'); setTimeout(() => { location.href = a.href; }, 260);
  });
  addEventListener('pageshow', e => { if (e.persisted) document.body.classList.remove('m-leaving'); });
})();
