# VozSegura · Landing Page

Landing page de **VozSegura**, protección contra estafas por clonación de voz con IA, pensada para adultos mayores (60+) y sus hijos cuidadores.

Es un sitio estático (HTML + Tailwind CSS por CDN + JavaScript), sin build, listo para **GitHub Pages**.

## Estructura

```
vozsegura_/
├── index.html                  # Página completa (todas las secciones)
├── assets/
│   ├── css/styles.css          # Estilos base, foco accesible, animaciones
│   ├── js/tailwind-config.js   # Tokens de diseño (colores, tipografía, espaciado)
│   ├── js/main.js              # Lógica: menú, semáforo, test, FAQ, analytics
│   └── img/logo.svg            # Logo (escudo + ondas de voz)
├── .github/workflows/deploy.yml  # Deploy automático a GitHub Pages
└── .nojekyll
```

## Secciones (modelo RACE)

1. Header con navegación y CTA "Probar Test Gratis" (+ menú móvil)
2. Hero con simulador interactivo del **Semáforo de Seguridad** (Voz Real / Voz Clonada)
3. El problema: "El engaño hoy suena a amor y urgencia"
4. **Test de riesgo** de 4 pasos con barra de progreso, puntaje dinámico (ej. *Riesgo Alto - 85% expuesto*), captura de email y botón para compartir por WhatsApp
5. Solución: Semáforo, Asistente Vozy, Loop de Protección Familiar
6. Testimonios y sellos de confianza
7. Planes: Freemium, SMART PRO, ELITE Familiar
8. Preguntas frecuentes (acordeón accesible + datos estructurados `FAQPage` para SEO)
9. CTA final / descarga y footer

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

`main.js` envía los eventos de la especificación a `window.dataLayer` (y a `gtag` si existe):
`click_hero_test_button`, `test_step_completed`, `test_completed`, `lead_captured_email`, `app_download_click`, `share_test_whatsapp`.
Para activar GA4, descomenta el bloque en el `<head>` de `index.html` y coloca tu ID.

## Pendientes

- Conectar el formulario de email a un servicio real (Formspree, Mailchimp, HubSpot…) en `main.js` (`#lead-form`).
- Reemplazar los enlaces `#` de Google Play, App Store y redes sociales por los reales.
