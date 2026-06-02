/* ════════════════════════════════════════════════════════
   STACKFLOW — script.js
════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL ─────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    const handleNavScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  // ── MOBILE MENU ────────────────────────────────────
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      burger.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';

      const spans = burger.querySelectorAll('span');
      if (burger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.classList.remove('active');
        document.body.style.overflow = '';
        const spans = burger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ── REVEAL ON SCROLL ───────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── COUNTER ANIMATION ──────────────────────────────
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el       = entry.target;
        const target   = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const step     = Math.ceil(target / (duration / 16));
        let current    = 0;

        const tick = () => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current < target) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

  // ── CLIENTS MARQUEE ────────────────────────────────
  const logosWrap = document.getElementById('clientsLogos');
  if (logosWrap) {
    const logos = Array.from(logosWrap.querySelectorAll('.clients__logo-item'));
    const inner      = document.createElement('div');
    const innerClone = document.createElement('div');
    inner.className      = 'clients__logos-inner';
    innerClone.className = 'clients__logos-inner';
    logos.forEach(l => inner.appendChild(l.cloneNode(true)));
    logos.forEach(l => innerClone.appendChild(l.cloneNode(true)));
    logosWrap.innerHTML = '';
    logosWrap.appendChild(inner);
    logosWrap.appendChild(innerClone);
  }

  // ── FAQ ACCORDION ──────────────────────────────────
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq__answer');
        const b = i.querySelector('.faq__question');
        if (a) a.style.maxHeight = '0';
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── CONTACT FORM VALIDATION ────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    const fields = {
      name:    { el: document.getElementById('name'),    err: document.getElementById('nameError') },
      company: { el: document.getElementById('company'), err: document.getElementById('companyError') },
      email:   { el: document.getElementById('email'),   err: document.getElementById('emailError') },
      phone:   { el: document.getElementById('phone'),   err: document.getElementById('phoneError') },
      segment: { el: document.getElementById('segment'), err: document.getElementById('segmentError') },
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setError = (field, hasError) => {
      if (!field.el || !field.err) return;
      field.el.classList.toggle('error', hasError);
      field.err.classList.toggle('show', hasError);
    };

    const validate = () => {
      let valid = true;

      if (!fields.name.el?.value.trim())                     { setError(fields.name, true);    valid = false; }
      else setError(fields.name, false);

      if (!fields.company.el?.value.trim())                  { setError(fields.company, true); valid = false; }
      else setError(fields.company, false);

      if (!emailRegex.test(fields.email.el?.value.trim()))   { setError(fields.email, true);   valid = false; }
      else setError(fields.email, false);

      if (!fields.phone.el?.value.trim())                    { setError(fields.phone, true);   valid = false; }
      else setError(fields.phone, false);

      if (!fields.segment.el?.value)                        { setError(fields.segment, true); valid = false; }
      else setError(fields.segment, false);

      return valid;
    };

    Object.values(fields).forEach(f => {
      if (f.el) {
        f.el.addEventListener('input', () => {
          if (f.el.classList.contains('error')) {
            f.el.classList.remove('error');
            f.err?.classList.remove('show');
          }
        });
      }
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) return;

      const btn = document.getElementById('submitBtn');
      if (btn) {
        btn.disabled = true;
        const span = btn.querySelector('span');
        if (span) span.textContent = 'Enviando...';
      }

      try {
        const response = await fetch('https://formspree.io/f/xjgznwbe', {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.style.display = 'none';
          if (formSuccess) {
            formSuccess.classList.add('show');
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          alert('Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
          if (btn) {
            btn.disabled = false;
            const span = btn.querySelector('span');
            if (span) span.textContent = 'Enviar mensagem';
          }
        }
      } catch (err) {
        alert('Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
        if (btn) {
          btn.disabled = false;
          const span = btn.querySelector('span');
          if (span) span.textContent = 'Enviar mensagem';
        }
      }
    });
  }

  // ── SMOOTH ANCHOR SCROLL ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── PARALLAX ON HERO ORBS ─────────────────────────
  // Apenas em desktop e se não há preferência por movimento reduzido
  const orbs = document.querySelectorAll('.hero__orb');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (orbs.length && !prefersReducedMotion && window.innerWidth >= 1024) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (orbs[0]) orbs[0].style.transform = `translateZ(0) translateY(${y * 0.12}px)`;
          if (orbs[1]) orbs[1].style.transform = `translateZ(0) translateY(${y * 0.06}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── DASHBOARD BAR ANIMATION ────────────────────────
  const barFills = document.querySelectorAll('.dash__bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const w  = el.dataset.width || '75';
        setTimeout(() => { el.style.width = w + '%'; }, 200);
        barObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  barFills.forEach(el => {
    el.style.width = '0';
    barObserver.observe(el);
  });

  // ── SCROLL PROGRESS BAR ────────────────────────────────
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total    = document.body.scrollHeight - window.innerHeight;
      scrollProgress.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
    }, { passive: true });
  }

  // ── TYPEWRITER ANIMATION ───────────────────────────────
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const phrases = [
      'Tecnologia que converte.',
      'Resultados que aparecem.',
      'Campanhas que vendem.',
      'Estratégia que funciona.',
      'Dados que transformam.'
    ];
    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting  = false;
    let paused    = false;

    const type = () => {
      if (paused) return;
      const phrase = phrases[phraseIdx];

      if (!deleting) {
        typewriterEl.textContent = phrase.slice(0, ++charIdx);
        if (charIdx === phrase.length) {
          deleting = true;
          paused   = true;
          setTimeout(() => { paused = false; setTimeout(type, 60); }, 2200);
          return;
        }
        setTimeout(type, 75);
      } else {
        typewriterEl.textContent = phrase.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting  = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 420);
          return;
        }
        setTimeout(type, 40);
      }
    };

    // Start after hero reveal animation
    setTimeout(type, 1400);
  }

  // ── CARD TILT EFFECT ───────────────────────────────────
  if (!prefersReducedMotion && window.innerWidth >= 768) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-5px) scale(1.01)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── LIVE DASHBOARD METRICS ─────────────────────────────
  const liveLeads = document.getElementById('liveLeads');
  const liveConv  = document.getElementById('liveConv');
  const liveCpl   = document.getElementById('liveCpl');

  if (liveLeads && liveConv && liveCpl) {
    const popEl = el => {
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');
    };

    const leadsPool = [2847, 2851, 2858, 2862, 2869, 2874];
    const convPool  = ['4.7%', '4.8%', '4.7%', '4.9%', '4.8%'];
    const cplPool   = ['R$12', 'R$11', 'R$12', 'R$11', 'R$10'];
    let tick = 0;

    setInterval(() => {
      tick = (tick + 1) % leadsPool.length;
      const idx = Math.floor(Math.random() * 3);
      if (idx === 0) {
        liveLeads.textContent = leadsPool[tick].toLocaleString('pt-BR');
        popEl(liveLeads);
      } else if (idx === 1) {
        liveConv.textContent = convPool[tick];
        popEl(liveConv);
      } else {
        liveCpl.textContent = cplPool[tick];
        popEl(liveCpl);
      }
    }, 3800);
  }

});
