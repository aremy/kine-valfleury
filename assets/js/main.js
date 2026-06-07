(function () {
  'use strict';

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
  const track  = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots   = Array.from(document.querySelectorAll('.carousel__dot'));
  const status = document.getElementById('carousel-status');
  const count  = dots.length;
  let current  = 0;
  let timer    = null;

  function goTo(n) {
    current = (n + count) % count;
    if (track) track.scrollTo({ left: current * track.offsetWidth, behavior: 'smooth' });
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

  if (track && count > 0) {
    prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.slide)));

    /* Pause on hover or keyboard focus within carousel */
    const carousel = track.closest('.carousel');
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
    track.addEventListener('scrollend', () => {
      if (!track.offsetWidth) return;
      const slide = Math.round(track.scrollLeft / track.offsetWidth);
      if (slide !== current) goTo(slide);
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

  /* ---- GA4 link tracking ---------------------------------- */
  window.trackLink = function (label) {
    if (typeof gtag === 'function') {
      gtag('event', 'click', {
        event_category: 'internal_link',
        event_label: label,
        transport_type: 'beacon',
      });
    }
  };
}());
