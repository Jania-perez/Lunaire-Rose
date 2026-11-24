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
  const mobileQuery = window.matchMedia('(max-width: 1140px)');
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

  // ---------- Navegación por vistas ----------
  // Cada sección (.view) se muestra de a una, sin scroll entre secciones.
  // La vista actual vive en el hash (#/coleccion), así funcionan el botón
  // "atrás", recargar la página y los enlaces directos.
  const app = document.getElementById('app');
  const views = Array.from(document.querySelectorAll('.view'));
  if (app && views.length) {
    const names = views.map((v) => v.dataset.view);
    const titles = {
      'inicio': 'Lunaire Rose — Boutique de vestidos en Cartagena',
      'mision-vision': 'Misión y Visión — Lunaire Rose',
      'nosotros': 'Sobre nosotros — Lunaire Rose',
      'coleccion': 'Colección — Lunaire Rose',
      'preguntas': 'Preguntas frecuentes — Lunaire Rose',
      'contacto': 'Contacto y citas — Lunaire Rose'
    };
    // Enlaces antiguos (index.html#coleccion, etc.) siguen funcionando.
    const legacy = {
      inicio: 'inicio', mision: 'mision-vision', vision: 'mision-vision',
      nosotros: 'nosotros', resenas: 'nosotros', coleccion: 'coleccion', contacto: 'contacto'
    };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = null;
    let timer = null;

    const routeFromHash = () => {
      let h = '';
      try { h = decodeURIComponent(location.hash.replace(/^#\/?/, '')); } catch (e) { /* hash inválido */ }
      if (names.includes(h)) return h;
      if (legacy[h]) return legacy[h];
      return current || 'inicio';
    };

    const setActiveLinks = (name) => {
      document.querySelectorAll('[data-route]').forEach((a) => {
        const on = a.dataset.route === name;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    };

    const show = (name, initial) => {
      if (name === current) return;
      const next = document.getElementById('view-' + name);
      const prev = current ? document.getElementById('view-' + current) : null;
      current = name;
      setActiveLinks(name);
      document.title = titles[name] || document.title;
      clearTimeout(timer);
      views.forEach((v) => {
        if (v !== prev && v !== next) v.classList.remove('active', 'leaving');
      });

      const reveal = () => {
        if (prev) prev.classList.remove('active', 'leaving');
        next.classList.add('active');
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (nav) nav.classList.remove('nav-hidden');
        if (!initial) app.focus({ preventScroll: true });
      };

      // Primero se desvanece la vista actual y luego aparece la nueva.
      const prevShown = prev && prev.classList.contains('active');
      if (initial || !prevShown || reduceMotion) {
        reveal();
      } else {
        prev.classList.remove('active');
        prev.classList.add('leaving');
        timer = setTimeout(reveal, 220);
      }
    };

    // Deja la URL en su forma canónica (#/vista); también arregla enlaces antiguos.
    const normalizeHash = (name) => {
      if (location.hash && location.hash !== '#/' + name) {
        try { history.replaceState(null, '', '#/' + name); } catch (e) { /* ignorar */ }
      }
    };

    window.addEventListener('hashchange', () => {
      const name = routeFromHash();
      show(name);
      normalizeHash(name);
    });

    // Tocar el enlace de la vista donde ya estás solo te lleva arriba.
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#/"]');
      if (!a) return;
      if (a.getAttribute('href').slice(2) === current) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    // El enlace "Saltar al contenido" no debe cambiar de vista.
    document.querySelector('.skip-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      app.focus();
    });

    const start = routeFromHash();
    show(start, true);
    normalizeHash(start);
  }

  // ---------- Preguntas frecuentes (acordeón) ----------
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = !item.classList.contains('open');
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // ---------- Agendar cita: arma el mensaje y abre WhatsApp ----------
  const citaForm = document.getElementById('cita-form');
  if (citaForm) {
    const WA_NUMBER = '573161025260';
    const $ = (id) => document.getElementById(id);
    const nombre = $('cita-nombre'), telefono = $('cita-telefono'), tipo = $('cita-tipo');
    const fecha = $('cita-fecha'), hora = $('cita-hora'), mensaje = $('cita-mensaje');
    const errorEl = $('cita-error');
    const fallbackWrap = $('cita-fallback');
    const fallbackLink = $('cita-fallback-link');

    const pad = (n) => String(n).padStart(2, '0');
    const todayStr = () => {
      const d = new Date();
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };
    const parseDate = (s) => {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d);
    };
    const fmtTime = (h, m) => {
      const suf = h >= 12 ? 'p. m.' : 'a. m.';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${h12}:${pad(m)} ${suf}`;
    };

    // Horario de atención: lunes a sábado, 8:00 a. m. a 5:00 p. m. Las franjas
    // son cada 30 min hasta las 4:30 p. m., para que la visita termine antes del cierre.
    const slots = [];
    for (let h = 8; h <= 16; h++) { slots.push([h, 0], [h, 30]); }

    fecha.min = todayStr();
    const buildSlots = () => {
      const keep = hora.value;
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const isToday = fecha.value === todayStr();
      hora.innerHTML = '<option value="">Elige una hora</option>';
      slots.forEach(([h, m]) => {
        if (isToday && h * 60 + m <= nowMin) return; // no mostrar horas que ya pasaron
        const o = document.createElement('option');
        o.value = o.textContent = fmtTime(h, m);
        hora.appendChild(o);
      });
      if (keep && Array.from(hora.options).some((o) => o.value === keep)) hora.value = keep;
    };
    buildSlots();
    fecha.addEventListener('change', buildSlots);

    citaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      citaForm.querySelectorAll('.field').forEach((f) => f.classList.remove('invalid'));
      errorEl.hidden = true;

      const fail = (msg, el) => {
        errorEl.textContent = msg;
        errorEl.hidden = false;
        el.closest('.field').classList.add('invalid');
        el.focus();
      };

      const data = {
        nombre: nombre.value.trim(),
        telefono: telefono.value.trim(),
        tipo: tipo.value,
        fecha: fecha.value,
        hora: hora.value,
        mensaje: mensaje.value.trim().slice(0, 500)
      };

      if (data.nombre.length < 3) return fail('Escribe tu nombre completo.', nombre);
      if (data.telefono.replace(/\D/g, '').length < 7) return fail('Escribe un número de teléfono válido.', telefono);
      if (!data.fecha) return fail('Elige la fecha de tu cita.', fecha);
      if (data.fecha < todayStr()) return fail('Elige una fecha desde hoy en adelante.', fecha);
      const day = parseDate(data.fecha);
      if (day.getDay() === 0) return fail('Los domingos permanecemos cerrados. Elige un día de lunes a sábado.', fecha);
      if (!data.hora) return fail('Elige la hora de tu cita.', hora);

      const fechaLarga = day.toLocaleDateString('es-CO', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
      const lines = [
        'Hola Lunaire Rose, quiero agendar una cita.',
        '',
        `Nombre: ${data.nombre}`,
        `Teléfono: ${data.telefono}`,
        `Tipo de visita: ${data.tipo}`,
        `Fecha: ${fechaLarga}`,
        `Hora: ${data.hora}`
      ];
      if (data.mensaje) lines.push(`Mensaje: ${data.mensaje}`);

      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
      const w = window.open(url, '_blank');
      if (w) w.opener = null;
      fallbackLink.href = url;
      fallbackWrap.hidden = false;
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
