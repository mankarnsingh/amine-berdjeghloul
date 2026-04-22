/* ============================================================
   AMINE BERDJEGHLOUL — PORTFOLIO JAVASCRIPT
   ============================================================ */

'use strict';

// ── CUSTOM CURSOR ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.14;
  trailY += (mouseY - trailY) * 0.14;
  if (trail) {
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Scale cursor on hover
document.querySelectorAll('a, button, .filter-btn, .project-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
    if (trail)  trail.style.transform  = 'translate(-50%,-50%) scale(1.4)';
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    if (trail)  trail.style.transform  = 'translate(-50%,-50%) scale(1)';
  });
});


// ── HERO CANVAS — Network nodes animation ──────────────────
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId;

  const NODE_COUNT = 60;
  const CONNECT_DIST = 140;
  const BLUE = 'rgba(93,115,126,';
  const ORANGE = 'rgba(255,159,28,';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * (window.innerWidth || 1200),
      y: Math.random() * (window.innerHeight || 800),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1,
      special: Math.random() < 0.12  // orange accent nodes
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.35;
          const col = (nodes[i].special || nodes[j].special) ? ORANGE : BLUE;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = col + alpha + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.special ? ORANGE + '0.85)' : BLUE + '0.65)';
      ctx.fill();
    });

    // Move nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  }
  draw();
})();


// ── NAV SCROLL EFFECT ──────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
  updateActiveNav();
});


// ── ACTIVE NAV LINK ──────────────────────────────────────
function updateActiveNav() {
  const sections = ['accueil', 'competences', 'projets', 'formations', 'contact'];
  const scrollY = window.scrollY + 120;
  sections.forEach(id => {
    const el = document.getElementById(id);
    const link = document.querySelector(`.nav-links a[data-section="${id}"]`);
    if (!el || !link) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (scrollY >= top && scrollY < bottom) link.classList.add('active');
    else link.classList.remove('active');
  });
}


// ── HAMBURGER MENU ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


// ── SCROLL REVEAL ──────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger siblings in the same grid
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Add stagger delays to grid children
document.querySelectorAll('.skills-grid .skill-card, .projects-grid .project-card, .timeline-item').forEach((el, i) => {
  el.dataset.delay = i * 90;
});

revealEls.forEach(el => revealObserver.observe(el));


// ── TERMINAL TYPEWRITER ────────────────────────────────────
const termBody = document.getElementById('terminalBody');
if (termBody) {
  const lines = [
    { type: 'prompt', text: 'whoami' },
    { type: 'out',    text: 'amine.berdjeghloul' },
    { type: 'prompt', text: 'cat formation.txt' },
    { type: 'out',    text: 'BUT R&T — Cybersécurité · IUT Villetaneuse' },
    { type: 'prompt', text: 'ls competences/' },
    { type: 'out',    text: 'reseaux/  cybersec/  telecom/  dev/' },
    { type: 'prompt', text: 'ping stage.entreprise.fr' },
    { type: 'out',    text: 'Disponible dès le 20 avril 2026 ✓' },
  ];

  let li = 0, ci = 0, isPrompt = true;
  let currentDiv = null;
  let timerId = null;

  function nextLine() {
    if (li >= lines.length) {
      // Restart animation after pause
      timerId = setTimeout(() => {
        termBody.innerHTML = '';
        li = 0; ci = 0; isPrompt = true; currentDiv = null;
        typeChar();
      }, 3000);
      return;
    }
    const line = lines[li];
    currentDiv = document.createElement('div');
    currentDiv.className = 'term-line';
    if (line.type === 'prompt') {
      currentDiv.innerHTML = '<span class="term-prompt">$ </span><span class="term-cmd"></span>';
    } else {
      currentDiv.innerHTML = '<span class="term-out"></span>';
    }
    termBody.appendChild(currentDiv);
    ci = 0;
    typeChar();
  }

  function typeChar() {
    const line = lines[li];
    const span = currentDiv.querySelector(line.type === 'prompt' ? '.term-cmd' : '.term-out');
    if (ci < line.text.length) {
      span.textContent += line.text[ci];
      ci++;
      timerId = setTimeout(typeChar, line.type === 'prompt' ? 60 : 18);
    } else {
      li++;
      timerId = setTimeout(nextLine, line.type === 'prompt' ? 400 : 200);
    }
  }

  // Observe terminal to start animation when visible
  const termObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      typeChar();
      termObs.disconnect();
    }
  }, { threshold: 0.5 });
  termObs.observe(termBody);
}


// ── PROJECT FILTER ─────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const tags = card.dataset.tags ? card.dataset.tags.split(' ') : [];
      if (filter === 'all' || tags.includes(filter)) {
        card.classList.remove('hidden');
        card.style.display = '';
        // Re-trigger reveal if not yet visible
        setTimeout(() => card.classList.add('visible'), 20);
      } else {
        card.classList.add('hidden');
        card.style.display = 'none';
      }
    });
  });
});


// ── SMOOTH SCROLL (for older Safari) ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ── PARALLAX HERO CONTENT ──────────────────────────────────
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  if (!heroContent) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroContent.style.transform = `translateY(${y * 0.18}px)`;
    heroContent.style.opacity = 1 - y / (window.innerHeight * 0.85);
  }
});
