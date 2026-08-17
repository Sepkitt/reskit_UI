import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { lightTheme, darkTheme } from "./vuetify-theme";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "darkTheme",
          variations: {
      colors: ['primary', 'secondary','surface','background'],
      lighten: 1,
      darken: 2,
    },
      themes: {
        lightTheme,
        darkTheme,
      },
    },
  });
  app.vueApp.use(vuetify);
});
