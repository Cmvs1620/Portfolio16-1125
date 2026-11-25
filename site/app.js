const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Videos play only while visible
if (still) $$('video').forEach(v => { v.controls = true; });
else {
  const io = new IntersectionObserver(es => es.forEach(({ target: v, isIntersecting }) => isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: .15 });
  $$('video').forEach(v => io.observe(v));
}

// Cases: each project is a dialog with its own #link
let opener = null;
const openCase = (id, from) => { if (from) opener = from; if (location.hash === '#' + id) sync(); else location.hash = id; };
const closeCase = () => history.replaceState(null, '', location.pathname + location.search);
function sync() {
  const id = decodeURIComponent(location.hash.slice(1));
  $$('dialog[open]').forEach(d => { if (d.id !== id) { d.dataset.switch = 1; d.close(); } });
  const d = document.getElementById(id);
  if (d && d.matches('dialog') && !d.open) { d.showModal(); d.scrollTop = 0; document.documentElement.style.overflow = 'hidden'; }
}
$$('dialog').forEach(d => {
  d.addEventListener('close', () => {
    if (d.dataset.switch) { delete d.dataset.switch; if (!document.querySelector('dialog[open]')) document.documentElement.style.overflow = ''; return; }
    document.documentElement.style.overflow = ''; closeCase(); if (opener) opener.focus({ preventScroll: true });
  });
  d.querySelector('.close').addEventListener('click', () => d.close());
  d.querySelector('.next').addEventListener('click', e => openCase(e.currentTarget.dataset.open));
});
addEventListener('hashchange', sync); sync();

// Work list: pointing at a name shows it and colours the page
const work = document.querySelector('.work'), items = $$('.work li');
const pick = li => {
  if (li.classList.contains('on')) return;
  items.forEach(x => x.classList.toggle('on', x === li));
  work.style.setProperty('--bg', li.dataset.bg); work.style.setProperty('--fg', li.dataset.fg);
};
items.forEach(li => {
  const b = li.querySelector('button');
  li.querySelector('.nm').addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') pick(li); });
  b.addEventListener('focus', () => pick(li));
  b.addEventListener('click', () => openCase(li.dataset.id, b));
});
{ // phone: the card in the middle of the strip is the active one
  const ul = document.querySelector('.work ul'); let t;
  ul.addEventListener('scroll', () => { cancelAnimationFrame(t); t = requestAnimationFrame(() => {
    if (ul.scrollWidth <= ul.clientWidth) return;
    const mid = ul.getBoundingClientRect().left + ul.clientWidth / 2;
    const dist = li => { const r = li.getBoundingClientRect(); return Math.abs(r.left + r.width / 2 - mid); };
    pick(items.reduce((a, b) => dist(b) < dist(a) ? b : a));
  }); }, { passive: true });
}

// Opening: cut-outs from the projects drop in and pile up. Letters join when pulled loose.
(async () => {
  const hero = document.querySelector('.hero'), h1 = hero.querySelector('h1'), els = $$('.ob');
  h1.querySelectorAll('.ln').forEach(ln => {
    ln.innerHTML = [...ln.textContent].map(c => c === ' ' ? ' ' : `<span class="th">${c}</span>`).join('');
  });
  if (!window.Matter) return;
  const { Engine, Bodies, Body, Composite, Constraint, Vertices } = Matter;
  await Promise.all(els.map(e => e.firstElementChild.decode().catch(() => {})));
  const outline = img => { // convex hull of the visible pixels, 0..1
    const w = 48, h = Math.max(8, Math.round(48 * img.naturalHeight / img.naturalWidth));
    const c = Object.assign(document.createElement('canvas'), { width: w, height: h }), x = c.getContext('2d');
    x.drawImage(img, 0, 0, w, h);
    const d = x.getImageData(0, 0, w, h).data, p = [];
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (d[(j * w + i) * 4 + 3] > 120) p.push({ x: (i + .5) / w, y: (j + .5) / h });
    return Vertices.hull(p);
  };
  const hulls = els.map(e => outline(e.firstElementChild));
  let engine, bodies, W, H, raf = 0, last = 0, drag = null, seen = true, quiet = 0;

  const add = (el, hull, w, h, cx, cy, angle, opts) => {
    const pts = hull.map(p => ({ x: p.x * w, y: p.y * h })), c = Vertices.centre(Vertices.clockwiseSort(pts));
    const body = Body.create({ position: { x: c.x, y: c.y }, vertices: Vertices.clockwiseSort(pts), restitution: .28, friction: .5, frictionAir: .012, ...opts });
    Body.setPosition(body, { x: cx - w / 2 + c.x, y: cy - h / 2 + c.y }); Body.setAngle(body, angle);
    Object.assign(body.plugin, { el, c }); bodies.push(body); Composite.add(engine.world, body);
    return body;
  };
  function build() {
    cancelAnimationFrame(raf); raf = 0; drag = null; quiet = 0;
    $$('.th', h1).forEach(t => { t.style.transform = ''; delete t.body; });
    W = hero.clientWidth; H = hero.clientHeight; bodies = [];
    engine = Engine.create({ enableSleeping: true }); engine.gravity.y = 1.1;
    const T = 400, fix = { isStatic: true, friction: .6 };
    Composite.add(engine.world, [Bodies.rectangle(W / 2, H + T / 2, W + T * 4, T, fix), Bodies.rectangle(-T / 2, 0, T, H * 8, fix), Bodies.rectangle(W + T / 2, 0, T, H * 8, fix)]);
    const base = Math.max(.6, Math.min(1.35, Math.sqrt(W * H) / 1140)) * (W < 760 ? 1.02 : .74);
    els.forEach((el, i) => {
      const img = el.firstElementChild, ar = img.naturalWidth / img.naturalHeight, area = +el.dataset.s * base * 190;
      const w = area * Math.sqrt(ar), h = area / Math.sqrt(ar);
      el.style.width = w + 'px'; el.style.height = h + 'px';
      el.hidden = W < 760 && i > 9;
      if (el.hidden) return;
      const slot = (i * 5 + 2) % 12 / 12;
      add(el, hulls[i], w, h, W * (.08 + .84 * slot), -h - i * (W < 760 ? 150 : 120), (Math.random() - .5) * 1.1);
    });
    if (still) for (let i = 0; i < 420; i++) Engine.update(engine, 16.7);
    draw(); els.forEach(e => { e.style.visibility = 'visible'; });
    if (!still) wake();
  }
  function draw() {
    for (const b of bodies) {
      const { el, c, home } = b.plugin, x = b.position.x - c.x - (home ? home.x : 0), y = b.position.y - c.y - (home ? home.y : 0);
      el.style.transformOrigin = `${c.x}px ${c.y}px`;
      el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${b.angle.toFixed(3)}rad)`;
    }
  }
  function step(now) {
    raf = 0;
    const dt = Math.max(4, Math.min(32, now - last)); last = now;
    Engine.update(engine, dt / 2); Engine.update(engine, dt / 2); draw();
    quiet = drag || bodies.some(b => !b.isSleeping) ? 0 : quiet + 1;
    if (seen && quiet < 20) raf = requestAnimationFrame(step);
  }
  const wake = () => { quiet = 0; if (!raf && seen) { last = performance.now(); raf = requestAnimationFrame(step); } };
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen) wake(); }).observe(hero);

  const local = e => { const r = hero.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const loosen = t => { // turn a letter into a body where it stands
    const r = t.getBoundingClientRect(), o = hero.getBoundingClientRect(), w = r.width, h = r.height;
    const b = add(t, [{ x: .04, y: .06 }, { x: .96, y: .06 }, { x: .96, y: .96 }, { x: .04, y: .96 }], w, h, r.left - o.left + w / 2, r.top - o.top + h / 2, 0);
    b.plugin.home = { x: r.left - o.left, y: r.top - o.top }; t.body = b; return b;
  };
  hero.addEventListener('pointerdown', e => {
    const el = e.target.closest('.ob,.th'); if (!el || e.button > 0) return;
    if (still) { drag = { el, moved: 0 }; return; }
    const p = local(e), b = el.body || bodies.find(b => b.plugin.el === el);
    drag = { el, p, id: e.pointerId, b, moved: 0, sx: e.clientX, sy: e.clientY };
    el.setPointerCapture(e.pointerId);
  });
  hero.addEventListener('pointermove', e => {
    if (!drag || still) return;
    drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy));
    if (drag.moved < 5) return;
    if (!drag.c) {
      drag.b = drag.b || loosen(drag.el); drag.el.classList.add('grab');
      $$('.ob,.th').forEach(x => { if (x.style.zIndex) x.style.zIndex = ''; }); drag.el.style.zIndex = 9;
      const b = drag.b, dx = drag.p.x - b.position.x, dy = drag.p.y - b.position.y, a = -b.angle;
      drag.c = Constraint.create({ pointA: local(e), bodyB: b, pointB: { x: dx, y: dy }, length: .01, stiffness: .12, damping: .08 });
      Composite.add(engine.world, drag.c);
    }
    drag.c.pointA = local(e); Matter.Sleeping.set(drag.b, false); wake();
  });
  const end = e => {
    if (!drag) return;
    const d = drag; drag = null; d.el.classList.remove('grab');
    if (d.c) { Composite.remove(engine.world, d.c); const v = d.b.velocity, s = Math.hypot(v.x, v.y); if (s > 45) Body.setVelocity(d.b, { x: v.x / s * 45, y: v.y / s * 45 }); wake(); }
    else if (e.type === 'pointerup' && d.moved < 5 && d.el.dataset.open) openCase(d.el.dataset.open, d.el);
  };
  hero.addEventListener('pointerup', end); hero.addEventListener('pointercancel', end);
  els.forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCase(el.dataset.open, el); } }));
  await document.fonts.ready; build();
  let rw = innerWidth, t; addEventListener('resize', () => { if (innerWidth === rw) return; rw = innerWidth; clearTimeout(t); t = setTimeout(build, 200); });
})();

// Contact form (Formspree)
(() => {
  const form = document.getElementById('form'), status = form.querySelector('.status'), btn = form.querySelector('button');
  const F = n => form.elements[n];
  const checks = {
    name: () => F('name').value.trim() ? '' : 'Add your name.',
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(F('email').value.trim()) ? '' : 'Add an email address I can reply to.',
    message: () => F('message').value.trim().length >= 10 ? '' : 'Write at least a sentence.',
  };
  const show = (n, m) => { document.getElementById('e-' + n).textContent = m; F(n).toggleAttribute('aria-invalid', !!m); if (m) F(n).setAttribute('aria-invalid', 'true'); };
  for (const n in checks) F(n).addEventListener('input', () => { if (F(n).hasAttribute('aria-invalid')) show(n, checks[n]()); });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = ''; status.removeAttribute('data-bad');
    let bad = null;
    for (const n in checks) { const m = checks[n](); show(n, m); if (m && !bad) bad = n; }
    if (bad) return F(bad).focus();
    if (F('_gotcha').value) return;
    const v = n => F(n).value.trim();
    btn.disabled = true; btn.textContent = 'Sending';
    try {
      const r = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: v('name'), email: v('email'), message: v('message'), _subject: `Portfolio enquiry from ${v('name')}` }) });
      if (!r.ok) throw 0;
      form.reset(); status.textContent = 'Sent. I\'ll reply by email.';
    } catch { status.setAttribute('data-bad', ''); status.textContent = 'That didn\'t send. Please email me directly instead.'; }
    btn.disabled = false; btn.textContent = 'Send';
  });
})();
