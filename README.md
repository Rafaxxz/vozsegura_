# VozSegura · Landing Page

Landing page de **VozSegura**, protección contra estafas por clonación de voz con IA, pensada para adultos mayores (60+) y sus hijos cuidadores.

Es un sitio estático (HTML + Tailwind CSS por CDN + JavaScript), sin build, listo para **GitHub Pages**.

## Estructura

El sitio tiene **una página HTML por sección**. Todas comparten el mismo encabezado, pie de página,
Test de Riesgo (ventana modal) y asistente Vozy.

```
vozsegura_/
├── index.html                  # Inicio: hero con simulador del semáforo + accesos a cada página
├── el-problema.html            # El engaño hoy suena a amor y urgencia
├── test-de-riesgo.html         # Presentación del Test de Riesgo Familiar
├── como-funciona.html          # Semáforo, asistente Vozy y loop de protección familiar
├── prueba-gratis.html          # Prueba de 14 días de SMART PRO con formulario
├── planes.html                 # Freemium, SMART PRO y ELITE Familiar
├── nosotros.html               # Propuesta de valor, misión, visión, valores, video y equipo
├── preguntas-frecuentes.html   # FAQ (acordeón + datos estructurados FAQPage para SEO)
├── blog.html                   # Últimas entradas de https://vozsegurape.blogspot.com/
├── descarga.html               # Google Play, App Store, código QR y pasos para instalar
├── assets/
│   ├── css/styles.css          # Estilos base, foco accesible, animaciones
│   ├── js/tailwind-config.js   # Tokens de diseño exportados de Stitch (colores, tipografía, espaciado)
│   ├── js/main.js              # Lógica compartida: menú, semáforo, test, formularios, FAQ, blog, Vozy
│   ├── img/logo.svg            # Favicon (escudo + ondas de voz)
│   ├── img/vozy-mascota.png    # Mascota Vozy
│   └── img/qr-descarga.svg     # QR que abre descarga.html
├── .github/workflows/deploy.yml  # Deploy automático a GitHub Pages
└── .nojekyll
```

### Cambiar algo que se repite en todas las páginas

El encabezado, el pie, el test y el chat de Vozy están copiados en cada archivo `.html`.
Si cambias uno de ellos (por ejemplo, un enlace del menú), aplica el mismo cambio en las 10 páginas.

El Test de Riesgo se abre desde cualquier página con un botón `data-open-test`,
o con un enlace que termine en `?test=1` (por ejemplo `planes.html?test=1`).

## Ver en local

```bash
python3 -m http.server 8000
```

Abrir http://localhost:8000

## Publicar en GitHub Pages

1. Sube el código a la rama `main` del repositorio.
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada push a `main` ejecuta `.github/workflows/deploy.yml` y publica el sitio en
   `https://<usuario>.github.io/<repositorio>/`.

> Alternativa sin Actions: **Settings → Pages → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.

## Analytics

`main.js` envía eventos a `window.dataLayer` (y a `gtag` si existe):
`click_hero_test_button`, `click_trial_cta`, `click_plan`, `test_step_completed`, `test_completed`,
`lead_captured`, `trial_activated`, `share_test_whatsapp`, `vozy_opened`, `vozy_question`.
Para activar GA4, descomenta el bloque en el `<head>` de `index.html` y coloca tu ID.

## Pendientes

- Los formularios (`#lead-form` del test y `#free-trial-form` de la prueba gratis) todavía **no envían datos a ningún
  servicio**: solo muestran la confirmación. Conectarlos a un backend/CRM (WhatsApp Business API, Formspree, HubSpot…) en `main.js`.
- La app aún no está en las tiendas: pega los enlaces en `STORE_URLS` (`main.js`). Mientras estén vacíos,
  los botones muestran "llega muy pronto" y llevan al formulario de prueba gratis.
- Video de presentación: pega el enlace *embed* de YouTube en `data-video-src` de `#intro-video` (`nosotros.html`).
- Vozy responde con un guion fijo (`VOZY_TOPICS` en `main.js`); no usa un modelo de IA.
- Las fotos de testimonios se cargan desde el hosting temporal de Stitch (con iniciales de respaldo si fallan):
  conviene reemplazarlas por archivos propios en `assets/img/`.
- Para producción, sustituir el CDN de Tailwind por un CSS compilado.
