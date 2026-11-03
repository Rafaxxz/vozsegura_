/**
 * VozSegura - Design tokens para Tailwind (CDN).
 * Paleta y escala tipográfica según "Especificaciones UI/UX y Dirección de Arte".
 */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semáforo
        "traffic-safe": "#10B981",
        "traffic-safe-border": "#047857",
        "traffic-safe-surface": "#ECFDF5",
        "traffic-danger": "#DC2626",
        "traffic-danger-border": "#B91C1C",
        "traffic-danger-surface": "#FEF2F2",

        // Marca
        primary: "#00236f",
        "primary-container": "#1e3a8a",
        secondary: "#0058be",
        "on-primary": "#ffffff",

        // Superficies
        "surface-canvas": "#F8FAFC",
        "surface-card": "#FFFFFF",
        "surface-card-subtle": "#F1F5F9",
        "surface-container": "#eaedff",
        "surface-variant": "#dae2fd",
        "error-container": "#ffdad6",
        "tertiary-fixed": "#6ffbbe",

        // Texto
        "text-primary": "#0F172A",
        "text-secondary": "#334155",
        "text-muted": "#475569",
        "on-surface-variant": "#444651",
        "border-strong": "#94A3B8",
        "border-subtle": "#CBD5E1",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1.25rem",
        "space-lg": "2rem",
        "space-xl": "3rem",
        "margin-mobile": "1rem",
        margin: "2.5rem",
        gutter: "1.5rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-hero": ["52px", { lineHeight: "64px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-hero-mobile": ["36px", { lineHeight: "46px", letterSpacing: "-0.01em", fontWeight: "800" }],
        "headline-lg": ["40px", { lineHeight: "50px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg-mobile": ["30px", { lineHeight: "38px", fontWeight: "700" }],
        "headline-md": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "headline-sm": ["22px", { lineHeight: "30px", fontWeight: "700" }],
        "body-xl": ["22px", { lineHeight: "34px" }],
        "body-lg": ["20px", { lineHeight: "32px" }],
        "body-md": ["18px", { lineHeight: "28px" }],
        "label-lg": ["18px", { lineHeight: "24px", letterSpacing: "0.02em", fontWeight: "700" }],
        "label-md": ["16px", { lineHeight: "22px", letterSpacing: "0.01em", fontWeight: "600" }],
      },
    },
  },
};
