import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

export const lightTheme = {
  dark: false,
  colors: {
    // Shifting from pure white to a soft workspace grey
    background: "#F1F5F9",
    surface: "#FFFFFF",
    baseCard: "#f6f3f3",
    "surface-variant": "#F8FAFC", // Used for URL bars/nested areas

    primary: "#1976D2",
    darkness: "#E2E8F0", // Darker neutral for secondary backgrounds
    text: "#0F172A", // Deep navy-black for better readability
    "on-primary": "#FFFFFF",

    secondary: "#D27519",
    "on-secondary": "#FFFFFF",
    accent: "#00B0FF",

    error: "#EF4444",
    info: "#334155", // Navy for professional toolbars
    success: "#10B981",
    warning: "#F59E0B",

    // Grid and border colors
    outline: "#CBD5E1", // Subtle borders
  },
} as const;

export const darkTheme = {
  dark: true,
  colors: {
    // Deeper, inkier black for the foundation
    background: "#020617",
    surface: "#0F172A", // Navy-tinted dark grey for depth
    baseCard: "#1E293B", // The "blueprint" area
    "surface-variant": "#1E293B",

    primary: "#3B82F6", // Brighter blue for dark mode visibility
    darkness: "#000000",
    text: "#F8FAFC",
    "on-primary": "#000000",

    secondary: "#D27519",
    "on-secondary": "#1E293B",
    accent: "#7DD3FC",

    error: "#F87171",
    info: "#94A3B8", // Lighter slate for icons/secondary text
    success: "#34D399",
    warning: "#FBBF24",

    outline: "#334155", // Darker borders
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
