import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

export const lightTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#F8FAFC",
    baseCard: "#FFFFFF",
    "surface-variant": "#E2E8F0", // Use this for the grid lines
    primary: "#01C5FF",
    "on-primary": "#FFFFFF",
    secondary: "#D97706",
    "on-secondary": "#263F68",
    accent: "#C0F1FF",
    error: "#FE7484",
    info: "#263F68",
    success: "#16A34A",
    "on-success": "#263F68",
    warning: "#FE9E74",
    outline: "#CBD5E1", // Dedicated color for borders/grids
  },
} as const;

export const darkTheme = {
  dark: true,
  colors: {
    background: "#192841",
    surface: "#213556",
    baseCard: "#1d2f4f",
    "surface-variant": "#263F68", // Darker grid tint
    primary: "#01C5FF",
    "on-primary": "#000000",
    secondary: "#FBBF24",
    "on-secondary": "#263F68",
    accent: "#C0F1FF",
    outline: "#334155",
    // Standard utility colors stay consistent for UX patterns
    error: "#FE7484",
    info: "#263F68",
    success: "#22C55E",
    "on-success": "#263F68",
    warning: "#FE9E74",
  },
} as const;
// Export union type of color keys
export type ColorKeys = keyof typeof darkTheme.colors;

// Optional: exact literal values
export type ColorValues = (typeof darkTheme.colors)[ColorKeys];

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "darkTheme",
      themes: {
        lightTheme,
        darkTheme,
      },
    },
  });
  app.vueApp.use(vuetify);
});
