// Lunaire Rose — interacciones del sitio

document.addEventListener('DOMContentLoaded', () => {
  // Navbar sólida + parallax del hero al hacer scroll.
  const nav = document.getElementById('site-nav');
  const heroBg = document.getElementById('hero-bg');

  const onScroll = () => {
    const y = window.scrollY || 0;
    if (nav) {
      nav.classList.toggle('nav-solid', y > 40);
    }
    if (heroBg) {
      heroBg.style.transform = `translateY(${Math.min(y * 0.18, 90)}px)`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú hamburguesa en móvil
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.textContent = isOpen ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      });
    });
  }

  // Scroll-reveal: las secciones con la clase .reveal aparecen suavemente
  // cuando entran al viewport.
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

  // Precio "Consultar": oculto por defecto, aparece al hacer clic.
  document.querySelectorAll('[data-price-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest('[data-price-row]');
      const value = row.querySelector('[data-price-value]');
      value.classList.add('shown');
      btn.classList.add('hidden-after');
    });
  });

  // Aviso de cookies: se muestra una vez por visitante (localStorage), con
  // manejo defensivo por si el navegador bloquea el storage.
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    let alreadyAnswered = false;
    try {
      alreadyAnswered = localStorage.getItem('lr-cookies') !== null;
    } catch (e) { /* localStorage no disponible: mostramos el aviso igual */ }

    if (!alreadyAnswered) {
      setTimeout(() => banner.classList.add('shown'), 900);
    }

    const closeBanner = (value) => {
      banner.classList.remove('shown');
      try { localStorage.setItem('lr-cookies', value); } catch (e) { /* ignorar */ }
    };
    document.getElementById('cookie-accept')?.addEventListener('click', () => closeBanner('accepted'));
    document.getElementById('cookie-decline')?.addEventListener('click', () => closeBanner('declined'));
  }
});
