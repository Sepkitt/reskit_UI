// src/plugins/vuetify-theme.ts

export const lightTheme = {
  dark: false,
  colors: {
    background: "#c7d1db",
    surface: "#FFFFFF",
    baseCard: "#f6f3f3",
    "surface-variant": "#F8FAFC",

    primary: "#1976D2",
    darkness: "#E2E8F0",
    text: "#0F172A",
    "on-primary": "#FFFFFF",

    secondary: "#D27519",
    "on-secondary": "#FFFFFF",
    accent: "#00B0FF",

    error: "#EF4444",
    info: "#334155",
    success: "#10B981",
    warning: "#F59E0B",

    tertiary: "#67788c",
  },
} as const;

export const darkTheme = {
  dark: true,
  colors: {
    background: "#020617",
    surface: "#0F172A",
    baseCard: "#1E293B",
    "surface-variant": "#091220",

    primary: "#3B82F6",
    darkness: "#000000",
    text: "#F8FAFC",
    "on-primary": "#000000",

    secondary: "#D27519",
    "on-secondary": "#1E293B",
    accent: "#7DD3FC",

    error: "#F87171",
    info: "#94A3B8",
    success: "#34D399",
    warning: "#FBBF24",

    tertiary: "#334155",
  },
} as const;
