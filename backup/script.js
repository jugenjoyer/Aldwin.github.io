// Set year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth scrolling + active link
const links = document.querySelectorAll('.nav a');
links.forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', href);
      }
    }
  });
});

// Observe sections to highlight active menu item
const sections = document.querySelectorAll('section[id]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const navLink = document.querySelector(`.nav a[href="#${id}"]`);
    if (!navLink) return;
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav a.active').forEach(el => el.classList.remove('active'));
      navLink.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });

sections.forEach(section => observer.observe(section));

// Align outline overlay and headline to BACKGROUND image bounds (foreground untouched)
function alignHeroOverlay() {
  const stage = document.querySelector('.hero-stage');
  const bg = document.querySelector('.hero-img-bg');
  const overlay = document.querySelector('.hero-clip-over-image');
  const solid = document.querySelector('.hero-title--solid');
  const outline = document.querySelector('.hero-title--outline');
  if (!stage || !bg || !overlay) return;
  const apply = () => {
    // Geometry relative to the stage
    const stageRect = stage.getBoundingClientRect();
    const bgRect = bg.getBoundingClientRect();
    const bgLeft = bgRect.left - stageRect.left;
    const bgTop = bgRect.top - stageRect.top;

    // Read offsets from CSS custom properties
    const cs = getComputedStyle(stage);
    const offX = parseFloat(cs.getPropertyValue('--title-offset-x')) || 0; // px to move text left from bg
    const offY = parseFloat(cs.getPropertyValue('--title-offset-y')) || 0; // px down from bg top

    // Clip overlay exactly to the background image rectangle
    overlay.style.left = bgLeft + 'px';
    overlay.style.top = bgTop + 'px';
    overlay.style.width = bg.clientWidth + 'px';
    overlay.style.height = bg.clientHeight + 'px';

    // Place solid title to the LEFT of the background by offX and down by offY
    if (solid) {
      solid.style.left = (bgLeft - offX) + 'px';
      solid.style.top = (bgTop + offY) + 'px';
    }
    // Place outline title at the SAME absolute spot, but coordinates are within overlay's local box
    if (outline) {
      outline.style.left = (-offX) + 'px';
      outline.style.top = offY + 'px';
    }
  };
  if (bg.complete) apply();
  else bg.addEventListener('load', apply, { once: true });
}

window.addEventListener('load', alignHeroOverlay);
window.addEventListener('resize', alignHeroOverlay);

// Minimal loader hide on load
(() => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const digits = loader.querySelector('.loader-digits');

  const minDuration = 2000; // ms
  let start = null;
  let loadResolved = false;
  let minTimeResolved = false;

  // Animate 0 -> 100
  function step(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    const pct = Math.min(100, Math.round((elapsed / minDuration) * 100));
    if (digits) digits.textContent = pct + '%';
    if (pct < 100) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  function tryFinish() {
    if (loadResolved && minTimeResolved) {
      // Reveal main view (carousel fade-in is tied to body.loaded in CSS)
      document.body.classList.add('loaded');
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 450);
    }
  }

  // Ensure the loader stays up at least minDuration
  setTimeout(() => {
    minTimeResolved = true;
    tryFinish();
  }, minDuration);

  // Wait for real window load as well
  window.addEventListener('load', () => {
    loadResolved = true;
    // If animation finished early, digits should show 100%
    if (digits) digits.textContent = '100%';
    tryFinish();
  });
})();

// Enter site on carousel click: simply reveal content (no zoom, no scroll)
(() => {
  const items = document.querySelectorAll('.carousel-item');
  if (!items.length) return;
  let done = false;
  const enter = () => {
    if (done) return;
    done = true;
    document.body.classList.add('entered');
    // Recalculate overlay/outline positions now that the section is visible
    try { alignHeroOverlay(); } catch(e) {}
    // Run again on next frame to ensure layout is settled
    requestAnimationFrame(() => { try { alignHeroOverlay(); } catch(e) {} });
  };
  items.forEach(el => el.addEventListener('click', enter, { once: true }));
})();

// Camille-style horizontal carousel interactions: wheel, drag, inertia, parallax
(() => {
  const band = document.querySelector('.carousel');
  if (!band) return;
  const area = document.querySelector('.carousel-placeholder') || band;

  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let v = 0; // velocity in px/frame
  let lastPos = 0;
  let lastT = 0;

  const friction = 0.92; // inertia decay per frame
  const maxV = 60;       // clamp velocity
  const parallaxK = 0.12; // image translation factor

  const imgs = Array.from(band.querySelectorAll('.carousel-item .carousel-img'));

  function raf(now) {
    if (!lastT) lastT = now;
    // apply inertia
    if (Math.abs(v) > 0.08) {
      band.scrollLeft += v;
      v *= friction;
    }
    // parallax + in-view
    const rect = band.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;
    imgs.forEach(img => {
      const item = img.closest('.carousel-item');
      const r = item.getBoundingClientRect();
      const itemMid = r.left + r.width / 2;
      const dx = itemMid - mid; // px from center
      // parallax: move image opposite scroll a bit
      const px = Math.max(-30, Math.min(30, -dx * parallaxK / 10));
      img.style.transform = `translateX(${px}px)`;
      // in-view
      if (r.right > rect.left + 20 && r.left < rect.right - 20) item.classList.add('in-view');
      else item.classList.remove('in-view');
    });
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // wheel => horizontal
  function onWheel(e) {
    // choose the dominant axis so trackpads work too
    const dX = (typeof e.deltaX === 'number') ? e.deltaX : 0;
    const dY = (typeof e.deltaY === 'number') ? e.deltaY : (e.wheelDelta || 0);
    const delta = Math.abs(dX) > Math.abs(dY) ? dX : dY;
    if (!delta) return;
    e.preventDefault();
    band.scrollLeft += delta;
    v = Math.max(-maxV, Math.min(maxV, v + delta * 0.25));
  }
  band.addEventListener('wheel', onWheel, { passive: false });
  if (area !== band) area.addEventListener('wheel', onWheel, { passive: false });

  // drag (mouse)
  function onDown(clientX) {
    isDown = true;
    startX = clientX;
    startScroll = band.scrollLeft;
    lastPos = clientX;
    document.body.style.userSelect = 'none';
  }
  band.addEventListener('mousedown', (e) => onDown(e.clientX));
  if (area !== band) area.addEventListener('mousedown', (e) => onDown(e.clientX));
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    band.scrollLeft = startScroll - dx;
    // velocity from delta
    const dv = lastPos - e.clientX; // reversed so drag direction matches inertia
    v = Math.max(-maxV, Math.min(maxV, v * 0.75 + dv));
    lastPos = e.clientX;
  });
  ['mouseup','mouseleave','blur'].forEach(type => window.addEventListener(type, () => {
    if (!isDown) return; isDown = false; document.body.style.userSelect = '';
  }));

  // touch support (basic)
  band.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    isDown = true; startX = t.clientX; startScroll = band.scrollLeft; lastPos = t.clientX;
  }, { passive: true });
  band.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const t = e.touches[0];
    const dx = t.clientX - startX;
    band.scrollLeft = startScroll - dx;
    const dv = lastPos - t.clientX; v = Math.max(-maxV, Math.min(maxV, v * 0.75 + dv));
    lastPos = t.clientX;
  }, { passive: true });
  band.addEventListener('touchend', () => { isDown = false; });
})();
