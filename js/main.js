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
});
