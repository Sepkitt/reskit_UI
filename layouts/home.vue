<template>
  <v-app>
    <v-main class="home-layout-bg">
      <v-container fluid class="fill-height pa-0">
        <slot />
      </v-container>

      <div class="theme-toggle-wrapper">
        <!-- <v-btn
          icon
          size="large"
          color="primary"
          elevation="8"
          @click="toggleTheme"
        >
          <v-icon>
            {{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}
          </v-icon>
          <v-tooltip activator="parent" location="top">
            Switch to {{ isDark ? 'Light' : 'Dark' }} Mode
          </v-tooltip>
        </v-btn> -->
      
          <TooltipButton
          size="large"
          color="primary"
        :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
        :text="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"


        @click="toggleTheme"
      />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

// Check if the current theme is your 'darkTheme'
const isDark = computed(() => theme.global.name.value === 'darkTheme')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'lightTheme' : 'darkTheme'
}
</script>

<style lang="scss" scoped>
.home-layout-bg {
  // Use the 'background' color defined in your theme constants
  background-color: rgb(var(--v-theme-background));
  transition: background-color 0.3s ease;
}

.theme-toggle-wrapper {
  position: fixed;
  bottom: 32px;
  left: 32px;
  z-index: 1000;
}

/* Smooth transition for theme changes across the whole app */
:deep(.v-application) {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>