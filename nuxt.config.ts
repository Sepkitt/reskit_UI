// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: false,
  spaLoadingTemplate: "spa-loading-template.html",
  components: [
    {
      path: "~/components/",
      pathPrefix: false,
    },
  ],
  app: {
    pageTransition: { name: "blur-fade", mode: "out-in" },
    head: {
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },

  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],
  // Optional: Global configuration for persistence
  piniaPersistedstate: {
    storage: "cookies", // Recommended for Nuxt to avoid the "dark mode flash"
    cookieOptions: {
      sameSite: "lax",
    },
  },
  css: ["~/assets/css/main.css"],
  devtools: { enabled: false },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    // @ts-expect-error
    plugins: [vuetify({ autoImport: true })],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
