import { setup } from "@storybook/vue3-vite";
import type { Preview } from "@storybook/vue3-vite";

import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { lightTheme, darkTheme } from "../app/plugins/vuetify-theme";

const vuetify = createVuetify({
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

setup((app) => {
  app.use(vuetify);
});

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default preview;
