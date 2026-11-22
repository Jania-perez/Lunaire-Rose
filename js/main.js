// Lunaire Rose — interacciones del sitio

document.addEventListener('DOMContentLoaded', () => {
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
