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

// Selected Work carousel
const projectsGrid = document.querySelector('.proj-grid');
const projectPrev = document.getElementById('proj-prev');
const projectNext = document.getElementById('proj-next');

if (projectsGrid && projectPrev && projectNext) {
  const projectStep = () => projectsGrid.querySelector('.proj-card')?.getBoundingClientRect().width || 0;
  const updateProjectControls = () => {
    const end = projectsGrid.scrollWidth - projectsGrid.clientWidth;
    projectPrev.disabled = projectsGrid.scrollLeft <= 1;
    projectNext.disabled = projectsGrid.scrollLeft >= end - 1;
  };

  projectPrev.addEventListener('click', () => projectsGrid.scrollBy({ left: -projectStep(), behavior: 'smooth' }));
  projectNext.addEventListener('click', () => projectsGrid.scrollBy({ left: projectStep(), behavior: 'smooth' }));
  projectsGrid.addEventListener('scroll', updateProjectControls, { passive: true });
  window.addEventListener('resize', updateProjectControls);
  updateProjectControls();
}

// Hover-edge arrows for Selected Work
const projViewport = document.querySelector('.proj-viewport');
const projHoverLeft = document.querySelector('.proj-hover-left');
const projHoverRight = document.querySelector('.proj-hover-right');

if (projViewport && projHoverLeft && projHoverRight) {
  const onMove = e => {
    const r = projViewport.getBoundingClientRect();
    const x = e.clientX - r.left;
    projViewport.classList.remove('show-left','show-right');
    if (x < r.width * 0.18) projViewport.classList.add('show-left');
    else if (x > r.width * 0.82) projViewport.classList.add('show-right');
  };
  projViewport.addEventListener('mousemove', onMove);
  projViewport.addEventListener('mouseleave', () => projViewport.classList.remove('show-left','show-right'));

  projHoverLeft.addEventListener('click', () => projectsGrid.scrollBy({ left: -projectStep(), behavior: 'smooth' }));
  projHoverRight.addEventListener('click', () => projectsGrid.scrollBy({ left: projectStep(), behavior: 'smooth' }));

  projViewport.addEventListener('click', e => {
    const r = projViewport.getBoundingClientRect();
    const x = e.clientX - r.left;
    if (x < r.width * 0.18) projectsGrid.scrollBy({ left: -projectStep(), behavior: 'smooth' });
    else if (x > r.width * 0.82) projectsGrid.scrollBy({ left: projectStep(), behavior: 'smooth' });
  });
}

// Replace missing project images with generated SVG placeholders (no local file needed)
function makePlaceholderFor(img) {
  const card = img.closest('.proj-card');
  const title = card?.querySelector('.proj-info h3')?.textContent?.trim() || 'Project';
  const w = 1200, h = 675;
  const bg1 = encodeURIComponent('#f5f3ee');
  const bg2 = encodeURIComponent('#ece9e2');
  const accent = encodeURIComponent('#c8401f');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>\n  <defs>\n    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>\n      <stop offset='0' stop-color='${bg1}'/>\n      <stop offset='1' stop-color='${bg2}'/>\n    </linearGradient>\n  </defs>\n  <rect width='100%' height='100%' fill='url(#g)'/>\n  <rect x='60' y='60' width='520' height='360' rx='8' fill='%23ffffff11'/>\n  <text x='84' y='160' font-family='DM Sans, Arial, sans-serif' font-size='64' fill='%23000000' font-weight='700'>${title}</text>\n  <text x='84' y='220' font-family='DM Sans, Arial, sans-serif' font-size='20' fill='${accent}'>Live preview</text>\n</svg>`;
  const url = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svg);
  img.src = url;
  img.alt = title + ' preview';
}

document.querySelectorAll('.proj-img img').forEach(img => {
  img.addEventListener('error', () => makePlaceholderFor(img));
  // If the file is missing or hasn't loaded, create placeholder
  if (!img.complete || img.naturalWidth === 0) makePlaceholderFor(img);
});

// Same placeholder fallback for certificate thumbnails
function makePlaceholderForCert(img) {
  const card = img.closest('.cert-card');
  const title = card?.querySelector('.cert-info h3')?.textContent?.trim() || 'Certificate';
  const w = 1200, h = 825;
  const bg1 = encodeURIComponent('#f5f3ee');
  const bg2 = encodeURIComponent('#ece9e2');
  const accent = encodeURIComponent('#c8401f');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>\n  <defs>\n    <linearGradient id='g2' x1='0' x2='1' y1='0' y2='1'>\n      <stop offset='0' stop-color='${bg1}'/>\n      <stop offset='1' stop-color='${bg2}'/>\n    </linearGradient>\n  </defs>\n  <rect width='100%' height='100%' fill='url(#g2)'/>\n  <text x='84' y='140' font-family='DM Sans, Arial, sans-serif' font-size='48' fill='%23000000' font-weight='700'>${title}</text>\n  <text x='84' y='190' font-family='DM Sans, Arial, sans-serif' font-size='18' fill='${accent}'>Certificate</text>\n</svg>`;
  img.src = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svg);
  img.alt = title + ' placeholder';
}
document.querySelectorAll('.cert-img img').forEach(img => {
  img.addEventListener('error', () => makePlaceholderForCert(img));
  if (!img.complete || img.naturalWidth === 0) makePlaceholderForCert(img);
});

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
