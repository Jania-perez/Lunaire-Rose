# Lunaire Rose — Boutique de vestidos

Proyecto escolar (100% ficticio) para la entrega de "herramientas web": sitio
estático de una boutique de vestidos de lujo en Cartagena, Colombia.

## Estructura

- `index.html` — página principal con navegación por vistas (sin scroll entre secciones): Inicio (con video de bienvenida y código QR), Misión y Visión, Colección, Sobre nosotros (con Instalaciones y reseñas) y Contacto (agendar cita por WhatsApp y preguntas frecuentes)
- `terminos.html` — términos y condiciones, política de garantía, reclamos
- `404.html` — página de error personalizada
- `css/styles.css` — estilos (variables, tipografía, animaciones)
- `js/main.js` — router de vistas por hash (`#/coleccion`) con transición, menú móvil, FAQ, formulario de cita, scroll-reveal, parallax, precios "consultar"
- `assets/` — imágenes del sitio

## Cómo verlo localmente

Abre `index.html` en el navegador, o corre un servidor simple:

```
python3 -m http.server 8080
```

## Despliegue

Pensado para GitHub Pages (rama `main`, carpeta raíz).
