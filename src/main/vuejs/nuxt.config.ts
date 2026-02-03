// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  components: [
    {
      path: "~/components/",
      pathPrefix: false,
    },
  ],
  modules: ['@pinia/nuxt'],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: false },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    plugins: [vuetify({ autoImport: true })],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
