document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL ──────────────────────────
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── HAMBURGER ──────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // ── REVEAL ON SCROLL ───────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

  // ── FAQ ACCORDION ──────────────────────────
  window.toggleFaq = function(btn) {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  };

  // ── SMOOTH ANCHOR ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - nav.offsetHeight - 16, behavior: 'smooth' });
      }
    });
  });

});

// ── PARTICLES (hero only — minimalista) ────────────
(function () {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 3;
  `;
  hero.style.position = 'relative';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  const COLORS = [
    'rgba(229,21,46,',
    'rgba(255,60,60,',
    'rgba(180,10,30,',
    'rgba(255,100,100,',
    'rgba(140,0,20,',
  ];

  let W, H;
  const dots = [];
  let mouse = { x: -999, y: -999 };

  function resize() {
    const rect = hero.getBoundingClientRect();
    W = canvas.width  = rect.width;
    H = canvas.height = rect.height;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  hero.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  function Dot(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const spd   = Math.random() * 0.6 + 0.2;
    this.x      = x;
    this.y      = y;
    this.vx     = Math.cos(angle) * spd;
    this.vy     = Math.sin(angle) * spd;
    this.r      = Math.random() * 2 + 1;
    this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life   = 1;
    this.decay  = Math.random() * 0.018 + 0.008;
  }

  let frame = 0;

  function loop() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    if (frame % 2 === 0 && mouse.x > 0 && mouse.x < W && mouse.y > 0 && mouse.y < H) {
      dots.push(new Dot(mouse.x, mouse.y));
    }

    for (let i = dots.length - 1; i >= 0; i--) {
      const d = dots[i];
      d.x    += d.vx;
      d.y    += d.vy;
      d.life -= d.decay;

      if (d.life <= 0) { dots.splice(i, 1); continue; }

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.color + d.life.toFixed(2) + ')';
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  loop();
})();
