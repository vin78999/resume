// Theme toggle (progressive enhancement; system-preference fallback)
(function () {
    function getPreferredTheme() {
          try {
                  const stored = window.__theme;
                  if (stored) return stored;
          } catch (e) {}
          return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function applyTheme(t) {
          document.documentElement.setAttribute('data-theme', t);
          window.__theme = t;
    }
    applyTheme(getPreferredTheme());

   window.addEventListener('DOMContentLoaded', () => {
         const btn = document.getElementById('themeToggle');
         if (btn) {
                 btn.addEventListener('click', () => {
                           const cur = document.documentElement.getAttribute('data-theme');
                           applyTheme(cur === 'dark' ? 'light' : 'dark');
                 });
         }

                               const navToggle = document.getElementById('navToggle');
         const navLinks = document.getElementById('navLinks');
         if (navToggle && navLinks) {
                 navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
                 navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
         }

                               if ('IntersectionObserver' in window) {
                                       const els = document.querySelectorAll('.reveal, .stagger');
                                       els.forEach(el => el.classList.add('armed'));
                                       const obs = new IntersectionObserver((entries) => {
                                                 entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); } });
                                       }, { threshold: 0.12 });
                                       els.forEach(el => obs.observe(el));
                               }

                               const counters = document.querySelectorAll('[data-count]');
         if (counters.length && 'IntersectionObserver' in window) {
                 const countObs = new IntersectionObserver((entries) => {
                           entries.forEach(entry => {
                                       if (entry.isIntersecting) {
                                                     const el = entry.target;
                                                     const target = parseFloat(el.getAttribute('data-count'));
                                                     const dur = 900;
                                                     const start = performance.now();
                                                     function step(now) {
                                                                     const p = Math.min((now - start) / dur, 1);
                                                                     const eased = 1 - Math.pow(1 - p, 3);
                                                                     const val = target * eased;
                                                                     el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1));
                                                                     if (p < 1) requestAnimationFrame(step);
                                                                     else el.textContent = (target % 1 === 0 ? target : target.toFixed(1));
                                                     }
                                                     requestAnimationFrame(step);
                                                     countObs.unobserve(el);
                                       }
                           });
                 }, { threshold: 0.4 });
                 counters.forEach(c => countObs.observe(c));
         }

                               document.querySelectorAll('.model-chip').forEach(chip => {
                                       chip.addEventListener('click', () => {
                                                 document.querySelectorAll('.model-chip').forEach(c => { if (c !== chip) c.classList.remove('active'); });
                                                 chip.classList.toggle('active');
                                       });
                               });

                               const filterBtns = document.querySelectorAll('.filter-btn');
         const filterItems = document.querySelectorAll('[data-category]');
         if (filterBtns.length) {
                 filterBtns.forEach(btn => {
                           btn.addEventListener('click', () => {
                                       filterBtns.forEach(b => b.classList.remove('active'));
                                       btn.classList.add('active');
                                       const cat = btn.getAttribute('data-filter');
                                       filterItems.forEach(item => {
                                                     const show = cat === 'all' || item.getAttribute('data-category') === cat;
                                                     item.style.display = show ? '' : 'none';
                                                     if (show) {
                                                                     item.style.animation = 'none';
                                                                     requestAnimationFrame(() => { item.style.animation = 'fadeSlideIn .45s var(--ease)'; });
                                                     }
                                       });
                           });
                 });
         }

                               document.querySelectorAll('.faq-q').forEach(q => {
                                       q.addEventListener('click', () => {
                                                 const item = q.closest('.faq-item');
                                                 const wasOpen = item.classList.contains('open');
                                                 item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
                                                 if (!wasOpen) item.classList.add('open');
                                       });
                               });

                               document.querySelectorAll('[data-copy]').forEach(btn => {
                                       btn.addEventListener('click', () => {
                                                 const text = btn.getAttribute('data-copy');
                                                 const label = btn.querySelector('.copy-label');
                                                 if (navigator.clipboard && navigator.clipboard.writeText) {
                                                             navigator.clipboard.writeText(text).then(() => {
                                                                           if (label) {
                                                                                           const original = label.textContent;
                                                                                           label.textContent = '已复制';
                                                                                           setTimeout(() => { label.textContent = original; }, 1600);
                                                                           }
                                                             }).catch(() => {});
                                                 }
                                       });
                               });
   });
})();
