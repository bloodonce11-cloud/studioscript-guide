# StudioScript Guide

Web estática en español sobre Roblox Studio y Luau, hecha con HTML, CSS y JavaScript sin dependencias externas. Preparada para alojarse gratis en GitHub Pages.

## Archivos principales

- `index.html`: portada.
- `assets/`: estilos, JavaScript y favicon.
- `tutoriales/index.html`: índice de tutoriales.
- `tutoriales/primer-script-lua-roblox-studio/index.html`: guía inicial, todavía marcada como borrador y `noindex`; no debe considerarse verificada hasta probar todos sus pasos y códigos en Roblox Studio.
- `tutoriales/_plantilla/index.html`: plantilla interna para redactar nuevos tutoriales. GitHub Pages con Jekyll suele omitir rutas que empiezan por `_`; no añadas `.nojekyll` si no quieres que esta plantilla quede publicada.
- `about/`, `contact/`, `privacy-policy/`: páginas informativas.
- `404.html`: página de error configurada para el repositorio `studioscript-guide`.

## Antes de subirlo

1. Crea un repositorio público llamado exactamente `studioscript-guide` en tu cuenta de GitHub. No necesitas compartir tu contraseña ni ningún token.
2. Sube el contenido de esta carpeta al nivel raíz del repositorio (debe quedar `index.html` en la raíz, no una carpeta extra anidada).
3. En GitHub, abre **Settings → Pages** y configura la publicación desde la rama `main`, carpeta `/(root)`. Guarda y espera a que termine el despliegue.
4. La URL tendrá el formato `https://TU-USUARIO.github.io/studioscript-guide/`. Sustituye `TU-USUARIO` por tu nombre real de GitHub únicamente cuando lo conozcas. No publiques URLs de ejemplo.
5. La página `404.html` usa la ruta `/studioscript-guide/`; por eso el repositorio debe conservar exactamente ese nombre.
6. Comprueba la portada, los enlaces, el buscador, la versión móvil y la página 404.

## SEO después del despliegue

No se incluye un `sitemap.xml` con URLs ficticias. Una vez conocida la URL real, prepara un sitemap con URLs absolutas del sitio y envíalo en Google Search Console. En una web de proyecto de GitHub Pages, `robots.txt` queda bajo `/studioscript-guide/`, no en la raíz del dominio, así que no dependas de ese archivo para declarar el sitemap. Las etiquetas canónicas y `og:url` se han omitido temporalmente porque no conocemos aún la URL real. Cuando esté desplegada, se pueden añadir usando la URL definitiva.

## Pendientes antes de una web pública plenamente terminada

- Revisar la página de privacidad con los datos reales del responsable y el funcionamiento real del sitio. El texto actual es provisional, no asesoramiento legal y no debe tratarse como política final para monetización.
- Si quieres recibir consultas, añade una dirección de contacto real que estés dispuesto a hacer pública. No dejes direcciones de ejemplo.
- La página Acerca de evita afirmar experiencia personal o pruebas que no se han confirmado. Personalízala solo con información cierta.
- Verifica la guía inicial completa en Roblox Studio antes de quitar su aviso de borrador y la etiqueta `noindex`. No la añadas al sitemap mientras siga en borrador/noindex.
- Revisa la fecha visible y `datePublished`/`dateModified` del artículo cuando lo hayas verificado y publicado.

## AdSense

No hay anuncios ni código de AdSense en estos archivos. GitHub Pages aloja archivos estáticos; no garantiza aprobación de AdSense. Antes de solicitar monetización, publica contenido original, útil y verificado, completa las páginas informativas y revisa las políticas vigentes de Google.
