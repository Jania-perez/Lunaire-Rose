// Lunaire Rose — interacciones del sitio

document.addEventListener('DOMContentLoaded', () => {
  // Transición entre páginas: se revela la página actual con un fundido,
  // y al salir por un link interno (ej. a terminos.html) se cubre de
  // nuevo antes de navegar, para que no se sienta como un salto brusco.
  const transitionEl = document.getElementById('page-transition');
  if (transitionEl) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => transitionEl.classList.add('hidden'));
    });

    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      const isInternalPage = href && /\.html(#.*)?$/.test(href) && !link.target;
      if (!isInternalPage) return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        transitionEl.classList.remove('hidden');
        transitionEl.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 420);
      });
    });
  }

  // Navbar sólida + parallax del hero al hacer scroll.
  const nav = document.getElementById('site-nav');
  const heroBg = document.getElementById('hero-bg');

  // En móvil el header se oculta al bajar y reaparece al subir.
  const mobileQuery = window.matchMedia('(max-width: 720px)');
  let lastY = window.scrollY || 0;

  const onScroll = () => {
    const y = window.scrollY || 0;
    if (nav) {
      nav.classList.toggle('nav-solid', y > 40);

      if (mobileQuery.matches && !document.body.classList.contains('menu-open')) {
        const delta = y - lastY;
        if (y <= 40 || delta < -4) {
          nav.classList.remove('nav-hidden');   // arriba del todo o subiendo
        } else if (delta > 4) {
          nav.classList.add('nav-hidden');      // bajando
        }
      }
    }
    lastY = y;
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
    const setMenu = (open) => {
      navLinks.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      navToggle.textContent = open ? '✕' : '☰';
      if (open && nav) nav.classList.remove('nav-hidden');
    };

    navToggle.addEventListener('click', () => {
      setMenu(!navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });
    // Si se pasa a escritorio con el menú abierto, se cierra y se restablece todo.
    mobileQuery.addEventListener('change', (e) => {
      if (!e.matches) {
        setMenu(false);
        if (nav) nav.classList.remove('nav-hidden');
      }
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

  // Efecto typewriter en el eslogan del hero (una sola vez, al cargar).
  const line1El = document.getElementById('type-line1');
  const line2El = document.getElementById('type-line2');
  const caretEl = document.querySelector('.type-caret');
  if (line1El && line2El) {
    const line1 = 'Cada vestido,';
    const line2 = 'una declaración';
    let i = 0, j = 0;
    const speed = 42;
    const typeLine1 = () => {
      if (i <= line1.length) {
        line1El.textContent = line1.slice(0, i);
        i++;
        setTimeout(typeLine1, speed);
      } else {
        setTimeout(typeLine2, 150);
      }
    };
    const typeLine2 = () => {
      if (j <= line2.length) {
        line2El.textContent = line2.slice(0, j);
        j++;
        setTimeout(typeLine2, speed);
      } else if (caretEl) {
        setTimeout(() => caretEl.classList.add('done'), 900);
      }
    };
    setTimeout(typeLine1, 500);
  }

  // Cursor personalizado: solo en dispositivos con mouse real (no táctiles).
  if (window.matchMedia('(pointer: fine)').matches) {
    document.documentElement.classList.add('has-custom-cursor');
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add('visible');
    });
    const loop = () => {
      cx += (tx - cx) * 0.35;
      cy += (ty - cy) * 0.35;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const hoverTargets = 'a, button, .product-card, .bento-tile, .social-badge';
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
  }

  // Contador animado: sube de 0 al año real la primera vez que entra en
  // pantalla (solo una vez, gracias a unobserve).
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const animate = () => {
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    } else {
      el.textContent = target;
    }
  });

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
