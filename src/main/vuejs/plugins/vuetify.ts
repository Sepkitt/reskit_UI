import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

const lightTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF", // Clean white for contrast
    surface: "#F8FAFC", // Very light grey-blue
    primary: "#01C5FF",
    "primary-darken-1": "#00A3D4",
    secondary: "#416BA2", // Using your text color as secondary
    accent: "#C0F1FF",
    error: "#FE7484",
    info: "#263F68",
    success: "#74FEA2",
    warning: "#FE9E74",
  },
};

const darkTheme = {
  dark: true,
  colors: {
    background: "#192841", // Your 'darkness' color
    surface: "#213556", // Your 'background' color
    primary: "#01C5FF",
    secondary: "#1C2D4A", // Your 'midnight'
    accent: "#C0F1FF",
    error: "#FE7484",
    info: "#263F68",
    success: "#74FEA2",
    warning: "#FE9E74",
    "on-background": "#FFFFFF",
    "on-surface": "#C0F1FF", // Using accent for text on dark surfaces
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
