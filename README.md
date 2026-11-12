# VozSegura · Landing Page

Landing page de **VozSegura**, protección contra estafas por clonación de voz con IA, pensada para adultos mayores (60+) y sus hijos cuidadores.

Es un sitio estático (HTML + Tailwind CSS por CDN + JavaScript), sin build, listo para **GitHub Pages**.

## Estructura

```
vozsegura_/
├── index.html                  # Página completa (secciones, modal del test y chat de Vozy)
├── assets/
│   ├── css/styles.css          # Estilos base, foco accesible, animaciones
│   ├── js/tailwind-config.js   # Tokens de diseño exportados de Stitch (colores, tipografía, espaciado)
│   ├── js/main.js              # Lógica: menú, semáforo, test, prueba gratis, FAQ, Vozy, analytics
│   ├── img/logo.svg            # Favicon (escudo + ondas de voz)
│   └── img/vozy-mascota.png    # Mascota Vozy (test de riesgo y chat)
├── .github/workflows/deploy.yml  # Deploy automático a GitHub Pages
└── .nojekyll
```

## Secciones

1. Header con navegación, CTA "Activar 14 Días Gratis" y menú móvil
2. Hero con simulador interactivo del **Semáforo de Seguridad** (Llamada IA / Llamada Real)
3. El problema: "El engaño hoy suena a amor y urgencia"
4. **Test de Riesgo Familiar** en ventana modal: 4 preguntas con opciones A–D, semáforo de puntaje en vivo
   (Bajo < 35 · Medio 35–59 · Alto ≥ 60), resultado con medidas recomendadas, envío del informe y compartir por WhatsApp
5. Cómo funciona: Semáforo, Asistente Vozy, Loop de Protección Familiar
6. **Prueba gratis de 14 días** de SMART PRO con formulario de activación
7. Planes: Freemium, SMART PRO, ELITE Familiar
8. Preguntas frecuentes (acordeón accesible + datos estructurados `FAQPage` para SEO)
9. **Blog**: muestra las 3 últimas entradas de https://vozsegurape.blogspot.com/ (feed de Blogger); si no carga, queda un enlace al blog
10. Footer y **asistente flotante Vozy** (chat con respuestas guiadas y dictado por voz en navegadores compatibles)

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
- Vozy responde con un guion fijo (`VOZY_TOPICS` en `main.js`); no usa un modelo de IA.
- Las fotos de testimonios se cargan desde el hosting temporal de Stitch (con iniciales de respaldo si fallan):
  conviene reemplazarlas por archivos propios en `assets/img/`.
- Para producción, sustituir el CDN de Tailwind por un CSS compilado.
