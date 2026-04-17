/**
 * Dublin Windows — App.js
 * Lenis smooth scroll + GSAP ScrollTrigger animations
 */

/* ── Lenis Smooth Scroll ──────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.25,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
});

gsap.registerPlugin(ScrollTrigger);

// Wire Lenis to GSAP ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Wire Lenis scroll to ScrollTrigger
lenis.on('scroll', () => {
  ScrollTrigger.update();
});

/* ── Navigation ───────────────────────────────────────────────── */
const nav       = document.getElementById('nav');
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

// Scrolled state
ScrollTrigger.create({
  start: 'top -80px',
  onEnter:     () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});

// Burger toggle
burger.addEventListener('click', () => {
  mobileNav.classList.add('open');
  lenis.stop();
});
mobileClose.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  lenis.start();
});
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    lenis.start();
  });
});

/* ── Hero entrance animation ──────────────────────────────────── */
const heroTL = gsap.timeline({ delay: 0.15 });

// Clip-reveal each title line
document.querySelectorAll('.ht-line').forEach((line, i) => {
  const inner = document.createElement('span');
  inner.innerHTML = line.innerHTML;
  inner.style.display = 'block';
  inner.style.transform = 'translateY(110%)';
  line.innerHTML = '';
  line.appendChild(inner);

  heroTL.to(inner, {
    y: '0%',
    duration: 1.15,
    ease: 'expo.out',
  }, i * 0.13);
});

heroTL
  .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, 0.1)
  .to('.hero-sub',     { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, 0.5)
  .to('.hero-actions', { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, 0.65)
  .to('.hero-trust',   { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' }, 0.78);

/* ── Hero pane-grid subtle entrance ──────────────────────────── */
gsap.set('.hero-pane-grid', { opacity: 0 });
gsap.to('.hero-pane-grid', {
  opacity: 1,
  duration: 3.0,
  ease: 'power1.out',
  delay: 0.6,
});

/* ── Section Reveal Helper ────────────────────────────────────── */
function clearReveal(el) {
  el.removeAttribute('data-reveal');
  gsap.set(el, { clearProps: 'all' });
}

function revealOnScroll(selector, vars = {}) {
  document.querySelectorAll(selector).forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true,
      },
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: vars.duration || 0.95,
      ease: vars.ease || 'expo.out',
      delay: vars.delay || 0,
      onComplete() { clearReveal(el); },
    });
  });
}

/* ── Slide from sides ─────────────────────────────────────────── */
revealOnScroll('[data-reveal="left"]',  { duration: 1.1 });
revealOnScroll('[data-reveal="right"]', { duration: 1.1 });

/* ── Fade up ──────────────────────────────────────────────────── */
document.querySelectorAll('[data-reveal="fade"]').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    opacity: 1,
    y: 0,
    duration: 0.95,
    ease: 'expo.out',
    delay: i * 0.08,
    onComplete() { clearReveal(el); },
  });
});

/* ── Scale up (cards) ─────────────────────────────────────────── */
document.querySelectorAll('[data-reveal="scale"]').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.85,
    ease: 'expo.out',
    delay: (i % 3) * 0.08,
    onComplete() { clearReveal(el); },
  });
});

/* ── Testimonials — cascade from bottom ──────────────────────── */
document.querySelectorAll('[data-reveal="bottom"]').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: 'expo.out',
    delay: (i % 3) * 0.1,
    onComplete() { clearReveal(el); },
  });
});

/* ── Why list stagger ─────────────────────────────────────────── */
gsap.set('.why-item', { opacity: 0, x: 28 });
ScrollTrigger.create({
  trigger: '.why-list',
  start: 'top 80%',
  once: true,
  onEnter: () => {
    gsap.to('.why-item', {
      opacity: 1,
      x: 0,
      duration: 0.75,
      ease: 'expo.out',
      stagger: 0.1,
    });
  },
});

/* ── Landmark list stagger ────────────────────────────────────── */
gsap.set('.landmark-list li', { opacity: 0, y: 10 });
ScrollTrigger.create({
  trigger: '.landmark-list',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    gsap.to('.landmark-list li', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'expo.out',
      stagger: 0.06,
    });
  },
});

/* ── Stats counter animation ──────────────────────────────────── */
document.querySelectorAll('.counter').forEach(el => {
  const target   = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0');
  const obj = { val: 0 };

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        val: target,
        duration: 2.2,
        ease: 'power3.out',
        onUpdate() {
          el.textContent = obj.val.toFixed(decimals);
        },
      });
    },
  });
});

/* ── Smooth anchor nav links ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -80, duration: 1.5 });
  });
});

/* ── Hero parallax ────────────────────────────────────────────── */
gsap.to('.hero-content', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.2,
  },
  y: 70,
  ease: 'none',
});

/* ── Pane grid parallax (subtle depth) ───────────────────────── */
gsap.to('.hero-pane-grid', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 0.8,
  },
  y: -30,
  ease: 'none',
});
