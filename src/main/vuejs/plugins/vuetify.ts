import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

const lightTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#F8FAFC",
    "surface-variant": "#E2E8F0", // Use this for the grid lines
    primary: "#01C5FF",
    "on-primary": "#FFFFFF",
    secondary: "#416BA2",
    "on-secondary": "#FFFFFF",
    accent: "#C0F1FF",
    error: "#FE7484",
    info: "#263F68",
    success: "#74FEA2",
    warning: "#FE9E74",
    outline: "#CBD5E1", // Dedicated color for borders/grids
  },
};

const darkTheme = {
  dark: true,
  colors: {
    background: "#192841",
    surface: "#213556",
    "surface-variant": "#263F68", // Darker grid tint
    primary: "#01C5FF",
    "on-primary": "#000000",
    secondary: "#1C2D4A",
    "on-secondary": "#C0F1FF",
    accent: "#C0F1FF",
    outline: "#334155",
    // Standard utility colors stay consistent for UX patterns
    error: "#FE7484",
    info: "#263F68",
    success: "#74FEA2",
    warning: "#FE9E74",
  },
};

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
