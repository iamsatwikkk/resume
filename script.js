/* =========================================
   SATWIK SOM — PORTFOLIO SCRIPT
   Advanced JS: Cursor, Scroll FX, Parallax,
   Reveal Animations, Tilt, Typewriter, Modal
   ========================================= */

'use strict';

/* ──────────────────────────────────────────
   1. CURSOR
────────────────────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth trail via RAF
(function animTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animTrail);
})();

// Scale on interactive elements
document.querySelectorAll('a, button, .skill-card, .cert-card, .project-item').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; cursorTrail.style.opacity = '0.5'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursorTrail.style.opacity = '1'; });
});

/* ──────────────────────────────────────────
   2. NAVBAR SCROLL STATE
────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ──────────────────────────────────────────
   3. MOBILE MENU
────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  // Animate hamburger
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ──────────────────────────────────────────
   4. SCROLL REVEAL  (IntersectionObserver)
────────────────────────────────────────── */
const revealTargets = [
  '.section-label', '.section-title', '.about-lead', '.about-body',
  '.edu-card', '.skill-card', '.project-item', '.cert-card',
  '.timeline-item', '.contact-item', '.contact-big'
];

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.children];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 80) + 'ms';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function attachReveal() {
  document.querySelectorAll(revealTargets.join(',')).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}
attachReveal();

/* ──────────────────────────────────────────
   5. HERO PARALLAX on mouse move
────────────────────────────────────────── */
const heroBgText = document.querySelector('.hero-bg-text');
const heroPhoto  = document.querySelector('.hero-photo-wrap');

document.querySelector('.hero').addEventListener('mousemove', e => {
  const rect = e.currentTarget.getBoundingClientRect();
  const cx   = (e.clientX - rect.left - rect.width  / 2) / rect.width;
  const cy   = (e.clientY - rect.top  - rect.height / 2) / rect.height;

  if (heroBgText) heroBgText.style.transform = `translate(calc(-50% + ${cx * 20}px), calc(-50% + ${cy * 10}px))`;
  if (heroPhoto)  heroPhoto.style.transform  = `translateX(${cx * -8}px) translateY(${cy * -8}px)`;
});

document.querySelector('.hero').addEventListener('mouseleave', () => {
  if (heroBgText) heroBgText.style.transform = 'translate(-50%, -50%)';
  if (heroPhoto)  heroPhoto.style.transform  = '';
});

/* ──────────────────────────────────────────
   6. SKILL CARD 3D TILT
────────────────────────────────────────── */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const cx   = x / rect.width  - 0.5;
    const cy   = y / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${cx * 10}deg) rotateX(${-cy * 10}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ──────────────────────────────────────────
   7. TYPEWRITER for HERO TAG
────────────────────────────────────────── */
const heroTag = document.querySelector('.hero-tag');
if (heroTag) {
  const phrases = [
    'Computer Science Engineer',
    'React & JavaScript Dev',
    'VIT Vellore, 2028',
    'Builder. Learner. Creator.',
  ];
  let pIdx = 0, cIdx = 0, deleting = false;
  const tagText = heroTag.querySelector('span') || heroTag;

  // Wrap original text in a span
  const typeSpan = document.createElement('span');
  typeSpan.textContent = phrases[0];
  heroTag.innerHTML = '';
  const bar = document.createElement('span');
  bar.innerHTML = '&nbsp;';
  heroTag.appendChild(typeSpan);
  heroTag.appendChild(bar);

  function type() {
    const current = phrases[pIdx];
    if (!deleting) {
      typeSpan.textContent = current.substring(0, cIdx + 1);
      cIdx++;
      if (cIdx === current.length) {
        setTimeout(() => { deleting = true; type(); }, 1800);
        return;
      }
      setTimeout(type, 70);
    } else {
      typeSpan.textContent = current.substring(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, 35);
    }
  }
  setTimeout(type, 1500);
}

/* ──────────────────────────────────────────
   8. SCROLLING PROGRESS BAR
────────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 2px; z-index: 9998;
  background: linear-gradient(to right, #c9a96e, #e8d5a3);
  transition: width 0.1s linear; width: 0%;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const totalH  = document.documentElement.scrollHeight - window.innerHeight;
  const percent = totalH > 0 ? (window.scrollY / totalH) * 100 : 0;
  progressBar.style.width = percent + '%';
}, { passive: true });

/* ──────────────────────────────────────────
   9. SECTION ACTIVE NAV HIGHLIGHTING
────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ──────────────────────────────────────────
   10. CERTIFICATE MODAL
────────────────────────────────────────── */
const modalOverlay = document.getElementById('modalOverlay');
const modalImg     = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');

function openModal(src, caption) {
  modalImg.src     = src;
  modalCaption.textContent = caption;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { modalImg.src = ''; }, 300);
}

// Close on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Expose globally for onclick handlers in HTML
window.openModal  = openModal;
window.closeModal = closeModal;

/* ──────────────────────────────────────────
   11. SMOOTH ANCHOR SCROLL
────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72');
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ──────────────────────────────────────────
   12. PROJECT LINK REDIRECT
────────────────────────────────────────── */
document.querySelectorAll('.project-item[data-link]').forEach(item => {
  const link = item.getAttribute('data-link');
  if (!link || link.startsWith('YOUR_')) return; // placeholder guard

  item.addEventListener('click', e => {
    // Don't fire if user clicks a nested <a> tag
    if (e.target.closest('a')) return;
    window.open(link, '_blank', 'noopener,noreferrer');
  });

  // Visual feedback — ripple on click
  item.addEventListener('pointerdown', e => {
    const ripple = document.createElement('span');
    const rect   = item.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:6px; height:6px;
      background:rgba(232,213,163,0.35);
      left:${e.clientX - rect.left - 3}px;
      top:${e.clientY - rect.top - 3}px;
      transform:scale(0); pointer-events:none;
      transition:transform 0.55s var(--ease-smooth), opacity 0.55s;
      z-index:10;
    `;
    item.style.position = 'relative';
    item.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(60)';
      ripple.style.opacity   = '0';
    });
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ──────────────────────────────────────────
   13. BACKGROUND GRID / DOT PATTERN (Canvas)
────────────────────────────────────────── */
(function drawBgGrid() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    opacity: 0.18;
  `;
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const spacing = 40;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  window.addEventListener('resize', resize);
  resize();
})();

/* ──────────────────────────────────────────
   13. FLOATING PARTICLES (Hero)
────────────────────────────────────────── */
(function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const symbols = ['◈', '⬡', '✦', '◇', '○', '+'];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span');
    p.className = 'hero-particle';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const size  = 0.5 + Math.random() * 0.8;
    const left  = 5 + Math.random() * 90;
    const delay = Math.random() * 8;
    const dur   = 8 + Math.random() * 8;
    p.style.cssText = `
      position: absolute;
      left: ${left}%;
      top: ${10 + Math.random() * 80}%;
      font-size: ${size}rem;
      color: rgba(201,169,110, ${0.08 + Math.random() * 0.12});
      pointer-events: none;
      user-select: none;
      animation: floatParticle ${dur}s ${delay}s ease-in-out infinite alternate;
      z-index: 1;
    `;
    hero.appendChild(p);
  }

  // Inject keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatParticle {
      from { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
      to   { transform: translateY(-30px) rotate(20deg); opacity: 0.12; }
    }
  `;
  document.head.appendChild(style);
})();

/* ──────────────────────────────────────────
   14. STATS COUNTER ANIMATION
────────────────────────────────────────── */
function animateCount(el, target, decimals = 0, suffix = '') {
  const duration = 1400;
  const start    = performance.now();
  const from     = 0;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = from + (target - from) * eased;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// CGPA badge — static, no counter animation needed
// Text is set directly in HTML as "9+ GPA"

/* ──────────────────────────────────────────
   15. GLITCH EFFECT on Nav Logo hover
────────────────────────────────────────── */
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
  navLogo.addEventListener('mouseenter', () => {
    navLogo.style.animation = 'none';
    const glitch = document.createElement('style');
    glitch.id = 'glitch-anim';
    glitch.textContent = `
      .nav-logo {
        animation: glitch 0.4s steps(1) forwards !important;
      }
      @keyframes glitch {
        0%  { text-shadow: none; }
        20% { text-shadow: 2px 0 #c9a96e, -2px 0 #4a9eff; letter-spacing: 0.05em; }
        40% { text-shadow: -2px 0 #c9a96e, 2px 0 #4a9eff; letter-spacing: -0.02em; }
        60% { text-shadow: 1px 0 #4a9eff; }
        80% { text-shadow: -1px 0 #c9a96e; }
        100%{ text-shadow: none; letter-spacing: -0.02em; }
      }
    `;
    document.head.appendChild(glitch);
    setTimeout(() => { document.getElementById('glitch-anim')?.remove(); }, 450);
  });
}

/* ──────────────────────────────────────────
   INIT LOG
────────────────────────────────────────── */
console.log('%c Satwik Som Portfolio ', 'background:#c9a96e;color:#0a0a0a;font-weight:800;font-size:14px;padding:4px 12px;border-radius:2px;');
console.log('%c Built with HTML · CSS · JS ', 'color:#888880;font-size:11px;');