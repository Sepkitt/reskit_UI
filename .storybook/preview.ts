import { setup } from "@storybook/vue3-vite";
import type { Preview } from "@storybook/vue3-vite";

import { vuetify } from "../app/utils/vuetify-plugin";

setup((app) => {
  app.use(vuetify);
});

const preview: Preview = {
  parameters: {
    args: { theme: "dark" },

    controls: {
      expanded: true,
    },
  },
};

export default preview;