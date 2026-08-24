import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { lightTheme, darkTheme } from "./vuetify-theme";

export const vuetify = createVuetify({
  components,
  directives,

  theme: {
    defaultTheme: "darkTheme",
    variations: {
      colors: ["primary", "secondary", "surface", "background"],
      lighten: 1,
      darken: 2,
    },
    themes: {
      lightTheme,
      darkTheme,
    },
  },
});
