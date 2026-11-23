/* SITE.JS — config values, WhatsApp, map, mobile menu, forms, carousels, FAQ. Isay edit karne ki zarurat nahi. */
(function () {
  const S = window.SITE || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = location.pathname.split('/').pop() || 'index.html';
  const wa = msg => S.whatsapp ? `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg || S.whatsappMessage || '')}` : '';

  // 1) Brand info
  $$('[data-site]').forEach(el => { const v = S[el.dataset.site]; if (v) el.textContent = v; });
  $$('a[href^="mailto:"]').forEach(a => { if (S.email) a.href = 'mailto:' + S.email; });
  $$('a[href^="tel:"]').forEach(a => { if (S.phone) a.href = 'tel:' + S.phone.replace(/[^\d+]/g, ''); });
  if (S.name) document.title = document.title.split(' | ')[0] + ' | ' + S.name;
  $$('[data-social]').forEach(a => { const u = (S.social || {})[a.dataset.social]; if (u) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; } else a.style.display = 'none'; });

  // 2) WhatsApp links + floating button
  $$('a[data-wa]').forEach(a => { const u = wa(); if (u) a.href = u; });
  if (S.whatsapp) {
    const b = document.createElement('a');
    b.className = 'wa-float'; b.href = wa(); b.target = '_blank'; b.rel = 'noopener'; b.setAttribute('aria-label', 'Chat on WhatsApp');
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg><span>Chat with us</span>';
    document.body.appendChild(b);
  }

  // 3) Google Map (contact page)
  const map = $('[data-map]');
  if (map) {
    const q = S.mapQuery || S.address || '';
    map.src = S.mapEmbed || `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    $$('[data-directions]').forEach(a => { a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`; a.target = '_blank'; a.rel = 'noopener'; });
  }

  // 4) Mobile header + menu
  const nav = $('nav');
  if (nav) {
    let wrap = nav;
    while (wrap.parentElement && wrap.parentElement !== document.body && !wrap.querySelector('[data-site="name"]')) wrap = wrap.parentElement;
    const nameEl = wrap.querySelector('[data-site="name"]');
    let brand = nameEl && (nameEl.closest('a') || nameEl.parentElement);
    if (brand && !brand.closest('a') && brand.tagName !== 'A') { const a = document.createElement('a'); a.href = 'index.html'; a.innerHTML = brand.innerHTML; brand = a; }
    if (brand && wrap.offsetHeight < 260) {
      wrap.classList.add('m-orig-nav');
      const links = (S.nav || []).map((n, i) => `<a href="${n.href}" ${n.href === page ? 'aria-current="page"' : ''} style="--i:${i}"><small>0${i + 1}</small>${n.label}</a>`).join('');
      const head = document.createElement('div'); head.className = 'm-mh';
      const b2 = brand.cloneNode(true); b2.classList.add('m-brand'); b2.removeAttribute('style'); head.appendChild(b2);
      head.insertAdjacentHTML('beforeend', '<button class="m-burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="m-menu"><i></i><i></i></button>');
      const menu = document.createElement('div'); menu.className = 'm-menu'; menu.id = 'm-menu'; menu.setAttribute('inert', '');
      menu.innerHTML = `<nav aria-label="Mobile">${links}</nav><div class="m-menu-cta">${S.whatsapp ? `<a class="m-cta" href="${wa()}" target="_blank" rel="noopener">Book on WhatsApp</a>` : `<a class="m-cta" href="contact.html">Book a Visit</a>`}${S.phone ? `<a class="m-cta alt" href="tel:${S.phone.replace(/[^\d+]/g, '')}">Call ${S.phone}</a>` : ''}</div>`;
      const spacer = document.createElement('div'); spacer.className = 'm-mh-spacer';
      document.body.prepend(spacer); document.body.append(head, menu);
      const burger = $('.m-burger', head), root = document.documentElement;
      const set = open => {
        root.classList.toggle('m-menu-open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menu.toggleAttribute('inert', !open); if (window.__smoother) window.__smoother.paused(open);
      };
      burger.addEventListener('click', () => set(!root.classList.contains('m-menu-open')));
      menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
      addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
      matchMedia('(min-width:901px)').addEventListener('change', e => { if (e.matches) set(false); });
    }
  }

  // 5) Mobile spacing: bade containers ko flag karo (CSS sirf mobile par padding kam karti hai)
  $$('div,section,footer,header,form,article').forEach(el => {
    const cs = getComputedStyle(el);
    if (parseFloat(cs.paddingLeft) >= 20 && parseFloat(cs.paddingRight) >= 20 && el.offsetWidth > 240) el.classList.add('m-tight');
  });

  // 6) FAQ accordion
  $$('[data-faq-toggle]').forEach(btn => btn.addEventListener('click', () => {
    const group = btn.parentElement.parentElement, open = btn.getAttribute('aria-expanded') !== 'true';
    $$('[data-faq-toggle]', group).forEach(b => {
      const on = b === btn && open, ans = b.nextElementSibling, ic = b.lastElementChild;
      b.setAttribute('aria-expanded', on);
      if (ans && ans.hasAttribute('data-faq-answer')) ans.hidden = !on;
      if (ic) ic.style.transform = on ? 'rotate(90deg)' : 'rotate(0deg)';
    });
  }));

  // 7) Services carousel
  const track = $('[data-svc-track]');
  if (track) {
    const cards = $$('[data-svc-card]', track), prev = $('[data-svc-prev]'), next = $('[data-svc-next]');
    let i = 0;
    const draw = () => {
      const visible = Math.max(1, Math.floor((innerWidth - 116 + 16) / 312)), max = Math.max(0, cards.length - visible);
      i = Math.min(i, max);
      track.style.transform = `translateX(calc((100% + 16px) / ${cards.length} * -${i}))`;
      prev.disabled = i <= 0; next.disabled = i >= max;
      prev.style.opacity = prev.disabled ? .4 : 1; next.style.opacity = next.disabled ? .4 : 1;
    };
    prev.addEventListener('click', () => { i = Math.max(0, i - 1); draw(); });
    next.addEventListener('click', () => { i++; draw(); });
    addEventListener('resize', draw); draw();
  }

  // 8) Testimonials stack
  const tc = $$('[data-t-card]');
  if (tc.length) {
    const prev = $('[data-t-prev]'), next = $('[data-t-next]'), bar = $('[data-t-progress]'); let t = 0;
    const draw = () => {
      const step = innerWidth < 720 ? 40 : 400;
      tc.forEach((c, k) => {
        const o = k - t, a = Math.abs(o);
        c.style.transform = `translateX(${o * step}px) translateY(${o * o * 16}px) rotate(${o * 6}deg)`;
        c.style.opacity = a > 2 ? 0 : 1; c.style.visibility = a > 2 ? 'hidden' : 'visible'; c.style.zIndex = 10 - a;
      });
      if (bar) bar.style.width = ((t + 1) / tc.length * 100) + '%';
      prev.disabled = t <= 0; next.disabled = t >= tc.length - 1;
      prev.style.opacity = prev.disabled ? .4 : 1; next.style.opacity = next.disabled ? .4 : 1;
    };
    prev.addEventListener('click', () => { t = Math.max(0, t - 1); draw(); });
    next.addEventListener('click', () => { t = Math.min(tc.length - 1, t + 1); draw(); });
    addEventListener('resize', draw); draw();
  }

  // 9) Forms: endpoint ho to wahan POST, warna WhatsApp khulta hai message likha hua
  $$('form').forEach(f => f.addEventListener('submit', async e => {
    e.preventDefault();
    const note = f.querySelector('.form-note') || f.appendChild(Object.assign(document.createElement('p'), { className: 'form-note', role: 'status' }));
    const rows = $$('input,textarea,select', f).filter(i => i.type !== 'submit' && i.value.trim()).map(i => {
      const l = (i.id && $(`label[for="${i.id}"]`, f)) || i.closest('label');
      return [(l ? l.textContent : i.getAttribute('aria-label') || i.placeholder || i.name || 'Field').replace(/[*:]/g, '').trim(), i.value.trim()];
    });
    const text = rows.length === 1 && f.querySelector('input[type=email]')
      ? `Hello ${S.name}, please add me to your dental tips list: ${rows[0][1]}`
      : `Hello ${S.name}, I would like to book an appointment.\n` + rows.map(([k, v]) => `${k}: ${v}`).join('\n');
    if (S.formEndpoint) {
      try { await fetch(S.formEndpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } }); note.textContent = 'Thank you! We will get back to you soon.'; f.reset(); }
      catch (_) { note.textContent = 'Something went wrong. Please try again or call us.'; }
    } else if (S.whatsapp) {
      note.textContent = 'Opening WhatsApp so you can send your message…'; open(wa(text), '_blank', 'noopener'); f.reset();
    } else note.textContent = 'Please call us on ' + (S.phone || 'our number') + ' to book.';
  }));
})();
