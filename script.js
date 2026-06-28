// Theme
const html = document.documentElement;
const mb = document.getElementById('mb');
const saved = localStorage.getItem('st-mode') || 'dark';
html.setAttribute('data-mode', saved);
mb.addEventListener('click', () => {
  const n = html.getAttribute('data-mode') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-mode', n);
  localStorage.setItem('st-mode', n);
});

// Nav hide/show on scroll
const navbar = document.getElementById('navbar');
let lastY = 0, ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y > lastY && y > 80) {
        navbar.classList.add('hide');
      } else {
        navbar.classList.remove('hide');
      }
      lastY = y;
      ticking = false;
    });
    ticking = true;
  }
}, {passive: true});

// Nav toggle mobile
function toggleNav() {
  document.getElementById('nl').classList.toggle('open');
}
function cm() {
  document.getElementById('nl').classList.remove('open');
  navbar.classList.remove('hide');
}

// Smooth scroll for nav links
document.querySelectorAll('#nl a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({behavior:'smooth'});
  });
});

// Scroll reveal
const io = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, {threshold: 0.1});
document.querySelectorAll('.sr').forEach(el => io.observe(el));

// Skill bars
const bio = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) e.target.style.width = e.target.dataset.w + '%';
  });
}, {threshold: 0.4});
document.querySelectorAll('.skill-fill').forEach(b => bio.observe(b));

// 3D tilt on photo
const slot = document.querySelector('.photo-slot');
if (slot && window.innerWidth > 900) {
  document.addEventListener('mousemove', e => {
    const r = slot.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / window.innerWidth * 14;
    const dy = (e.clientY - cy) / window.innerHeight * 10;
    slot.style.animation = 'none';
    slot.style.transform = `perspective(800px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    slot.style.animation = 'tilt 8s ease-in-out infinite';
  });
}

// Contact form
document.getElementById('cf').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('fn').value;
  const email = document.getElementById('fe').value;
  const subj = document.getElementById('fs').value || 'Inquiry';
  const msg = document.getElementById('fm').value;
  window.location.href = `mailto:tamotsidd7@gmail.com?subject=${encodeURIComponent(subj + ' (from ' + name + ')')}&body=${encodeURIComponent('From: ' + name + '\nReply-to: ' + email + '\n\n' + msg)}`;
  document.getElementById('cf').style.display = 'none';
  document.getElementById('fok').style.display = 'block';
});

// Active nav highlight
const secs = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (scrollY >= s.offsetTop - 80) cur = s.id; });
  document.querySelectorAll('#nl a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--ink)' : '';
  });
}, {passive: true});