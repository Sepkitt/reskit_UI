<template>
  <v-theme-provider
    :theme="isDark ? 'darkTheme' : 'lightTheme'"
    with-background
  >
    <v-app>
      <v-main>
        <v-container style="height: 100vh !important" class="fill-height">
          <v-row justify="center" align="center">
            <v-col cols="auto" align-self="center">
              <ErrorPage :error="error" />
            </v-col>
          </v-row>
        </v-container>
      </v-main> </v-app
  ></v-theme-provider>
</template>
<script setup>
import ErrorPage from "./components/ErrorPage.vue";
const props = defineProps({
  error: {
    type: Object,
    default: () => {},
  },
});
const { isDark } = useMyTheme();
</script>
