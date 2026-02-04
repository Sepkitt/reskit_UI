<template>
  <v-row align="center" justify="center" class="fill-height">
    <v-col cols="12" md="6" order="2" order-md="1">
      <v-row :class="{ 'text-center': mobile }">
        <v-col cols="12">
          <h1 class="text-  text-h2 font-weight-bold">
            Reskit <span class="text-primary">UI</span>
          </h1>
          <h2 class="text-subtitle-1 text-grey-lighten-1 font-weight-thin">
            Simulate devices in an array of different sizes
          </h2>
        </v-col>
        
        <v-col>
         <v-btn 
  size="x-large" 
  to="/UI" 
  flat
  class="px-8 tooltip-btn tooltip-primary"
>
  navigate to <span class="ml-2">UI</span>
</v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" md="3" class="d-flex justify-center justify-md-end" order="1" order-md="2">
      <v-img
        width="150"
        src="/Reskit_Logo.svg"
        class="hover"
      >
        <template #placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey-lighten-5" />
          </v-row>
        </template>
      </v-img>
    </v-col>
  </v-row>
</template>

<script setup>
import { useDisplay } from 'vuetify'

// Define the layout
definePageMeta({
  layout: 'home'
})

// Access responsive breakpoints
const { mobile } = useDisplay()
</script>

<style lang="scss" scoped>
.shadow-inset {
  /* Using your old button logic with updated naming */
  box-shadow: inset 4px 4px 11px rgba(0, 0, 0, 0.38) !important;
}

.hover {
  position: relative;
  animation: move 4s infinite ease-in-out;
}

@keyframes move {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(20px); }
}

:deep(a) {
  text-decoration: none;
}
/* Target the button specifically to use your tooltip logic */
.tooltip-btn {
  // Use your existing color-mix logic
  background-color: color-mix(
    in srgb,
    var(--t-color),
    rgb(var(--v-theme-surface)) 50%
  ) !important;
  
  color: var(--t-color) !important;
  border: 1px solid var(--t-color) !important;
  border-radius: 5px !important; // Match your tooltip-radius
  
  font-weight: 700;
  text-transform: none; // Keeps it modern
  letter-spacing: 0.5px;
  
  // Transition for the hover state
  transition: all 0.2s ease-in-out;

  &:hover {
    // Make it pop a bit more on hover like a real UI element
    background-color: color-mix(
      in srgb,
      var(--t-color),
      rgb(var(--v-theme-surface)) 40%
    ) !important;
    box-shadow: 0 0 15px rgba(var(--v-theme-primary), 0.2);
    transform: translateY(-1px);
  }
}

/* Ensure the Dark Mode mix ratio also applies to the button */
.v-theme--darkTheme .tooltip-btn {
  background-color: color-mix(
    in srgb,
    var(--t-color),
    rgb(var(--v-theme-surface)) 75%
  ) !important;
}
</style>