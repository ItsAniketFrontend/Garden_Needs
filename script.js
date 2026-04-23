/* =====================================================
   Garden's Need — Interactions
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- AOS init ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  /* ---------- Current year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    const bar = document.getElementById('scrollProgress');
    if (bar) bar.style.width = `${scrolled}%`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val.toLocaleString('en-IN') + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => countObserver.observe(c));

  /* ---------- Products Swiper ---------- */
  if (window.Swiper && document.querySelector('.products-swiper')) {
    new Swiper('.products-swiper', {
      slidesPerView: 1.1,
      spaceBetween: 20,
      centeredSlides: false,
      navigation: {
        nextEl: '#prodNext',
        prevEl: '#prodPrev'
      },
      breakpoints: {
        576: { slidesPerView: 1.6, spaceBetween: 20 },
        768: { slidesPerView: 2.3, spaceBetween: 24 },
        992: { slidesPerView: 3.2, spaceBetween: 26 },
        1200: { slidesPerView: 3.5, spaceBetween: 30 }
      },
      autoplay: {
        delay: 4200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }
    });
  }

  /* ---------- Testimonials Swiper ---------- */
  if (window.Swiper && document.querySelector('.testimonials-swiper')) {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      centeredSlides: false,
      grabCursor: true,
      pagination: {
        el: '.testimonials-swiper .swiper-pagination',
        clickable: true
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 }
      },
      autoplay: {
        delay: 5500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }
    });
  }

  /* ---------- Floating CTA ---------- */
  const floatQuote = document.getElementById('floatQuote');
  const hero = document.getElementById('hero');
  const leadForm = document.getElementById('leadForm');

  if (floatQuote && hero) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        floatQuote.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' }).observe(hero);

    if (leadForm) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) floatQuote.classList.remove('visible');
        });
      }, { threshold: 0.25 }).observe(leadForm);
    }
  }

  /* ---------- Lead form ---------- */
  const form = document.getElementById('leadForm');
  const success = document.getElementById('leadSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name  = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const phoneOk = phone.replace(/\D/g, '').length >= 10;

      let valid = true;
      [['name', !!name], ['email', emailOk], ['phone', phoneOk]].forEach(([id, ok]) => {
        const input = form[id];
        if (!ok) {
          input.classList.add('is-invalid');
          input.style.borderColor = '#d64545';
          valid = false;
        } else {
          input.classList.remove('is-invalid');
          input.style.borderColor = '';
        }
      });
      if (!valid) return;

      const btn = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Sending…';
      btn.disabled = true;

      setTimeout(() => {
        form.reset();
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => { success.hidden = true; }, 7000);
        }
      }, 950);
    });

    form.querySelectorAll('input, select, textarea').forEach((el) => {
      el.addEventListener('input', () => {
        el.style.borderColor = '';
        el.classList.remove('is-invalid');
      });
    });
  }

  /* ---------- Smooth anchor scroll with header offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1 || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile nav after click
      const nav = document.getElementById('primaryNav');
      if (nav && nav.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(nav);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

});
