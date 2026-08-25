import { vuetify } from "../utils/vuetify-plugin";

export default defineNuxtPlugin((app) => {
  app.vueApp.use(vuetify);
});
