(function () {
  'use strict';

  /* ---- GA4 helper ----------------------------------------- */
  function track(name, params) {
    if (typeof gtag === 'function') {
      gtag('event', name, Object.assign({ transport_type: 'beacon' }, params || {}));
    }
  }

  /* ---- Top App Bar scroll ---------------------------------- */
  const appBar = document.getElementById('app-bar');
  if (appBar) {
    const onScroll = () => appBar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile menu ---------------------------------------- */
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      if (open) {
        const first = navMenu.querySelector('.nav-link');
        first && first.focus();
      }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
        menuBtn.focus();
      });
    });

    /* Close on click outside */
    document.addEventListener('click', e => {
      if (appBar && !appBar.contains(e.target)) closeMenu();
    });

    /* Close on Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  /* ---- Image carousel ------------------------------------- */
  const carouselTrack = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots   = Array.from(document.querySelectorAll('.carousel__dot'));
  const status = document.getElementById('carousel-status');
  const count  = dots.length;
  let current  = 0;
  let timer    = null;

  function goTo(n) {
    current = (n + count) % count;
    if (carouselTrack) carouselTrack.scrollTo({ left: current * carouselTrack.offsetWidth, behavior: 'smooth' });
    dots.forEach((d, i) => {
      const active = i === current;
      d.classList.toggle('active', active);
      d.setAttribute('aria-selected', String(active));
    });
    /* Announce the slide label to screen readers */
    if (status && dots[current]) {
      status.textContent = dots[current].getAttribute('aria-label') || '';
    }
  }

  function startAutoplay() {
    timer = setInterval(() => goTo(current + 1), 5000);
  }
  function stopAutoplay() {
    clearInterval(timer);
    timer = null;
  }

  if (carouselTrack && count > 0) {
    prevBtn && prevBtn.addEventListener('click', () => {
      track('carousel_interaction', { method: 'prev' });
      goTo(current - 1);
    });
    nextBtn && nextBtn.addEventListener('click', () => {
      track('carousel_interaction', { method: 'next' });
      goTo(current + 1);
    });
    dots.forEach(d => d.addEventListener('click', () => {
      track('carousel_interaction', { method: 'dot' });
      goTo(+d.dataset.slide);
    }));

    /* Pause on hover or keyboard focus within carousel */
    const carousel = carouselTrack.closest('.carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
      carousel.addEventListener('focusin',    stopAutoplay);
      carousel.addEventListener('focusout',   e => {
        /* Only resume if focus left the carousel entirely */
        if (!carousel.contains(e.relatedTarget)) startAutoplay();
      });
    }

    /* Sync dot when user swipes */
    carouselTrack.addEventListener('scrollend', () => {
      if (!carouselTrack.offsetWidth) return;
      const slide = Math.round(carouselTrack.scrollLeft / carouselTrack.offsetWidth);
      if (slide !== current) {
        track('carousel_interaction', { method: 'swipe' });
        goTo(slide);
      }
    });

    startAutoplay();
  }

  /* ---- Map scroll-intercept overlay ---------------------- */
  const mapOverlay = document.getElementById('map-overlay');
  if (mapOverlay) {
    mapOverlay.addEventListener('click', function () {
      this.classList.add('dismissed');
    });
    /* Re-engage overlay when user scrolls away from map */
    window.addEventListener('scroll', function () {
      if (mapOverlay.classList.contains('dismissed')) {
        const rect = mapOverlay.closest('.map-frame').getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          mapOverlay.classList.remove('dismissed');
        }
      }
    }, { passive: true });
  }

  /* ---- Analytics: section visibility (IntersectionObserver) */
  if ('IntersectionObserver' in window) {
    const sectionObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          track('section_view', { section_id: entry.target.id });
          sectionObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    ['thepractice', 'contact', 'map'].forEach(id => {
      const el = document.getElementById(id);
      if (el) sectionObs.observe(el);
    });
  }

  /* ---- Analytics: hero CTA click -------------------------- */
  const heroCta = document.querySelector('.hero .btn-filled');
  if (heroCta) {
    heroCta.addEventListener('click', () => track('hero_cta_click'));
  }

  /* ---- Analytics: phone call (primary conversion) --------- */
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.addEventListener('click', () => {
      const source = a.closest('#contact') ? 'contact_section'
                   : a.closest('footer')   ? 'footer'
                   : 'other';
      track('clicked_appointment', { call_source: source });
    });
  });

  /* ---- Analytics: nav link clicks ------------------------- */
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      const href = a.getAttribute('href') || '';
      const section = href.split('#')[1] || href;
      track('nav_click', { section });
    });
  });

  /* ---- Analytics: language switch ------------------------- */
  const langSwitch = document.querySelector('.lang-switch');
  if (langSwitch) {
    langSwitch.addEventListener('click', () => {
      track('language_switch', { from_lang: document.documentElement.lang });
    });
  }

  /* ---- Analytics: external links -------------------------- */
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    a.addEventListener('click', () => {
      track('external_link_click', { destination: a.hostname });
    });
  });
}());
