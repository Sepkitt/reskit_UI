<template>
  <v-theme-provider
    :theme="isDark ? 'darkTheme' : 'lightTheme'"
    with-background
  >
    <v-app>
      <v-main>
        <ClientOnly>
          <NuxtPage />
        </ClientOnly>
      </v-main>
    </v-app>
  </v-theme-provider>
</template>

<script setup lang="ts">
const { isDark } = useMyTheme();
</script>
<style>
html {
  overflow-y: auto;
}
</style>
