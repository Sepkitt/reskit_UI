<template>
  <div class="error-container font-mono">
    <div class="error-header d-flex align-center mb-4">
      <v-icon color="error" class="mr-2">mdi-alert-octagon-outline</v-icon>
      <span class="text-error font-weight-bold">CRITICAL_SYSTEM_ERROR</span>
      <v-spacer />
      <span class="text-caption opacity-50">REF_ID: {{ error.statusCode || '500' }}</span>
    </div>

    <v-card variant="outlined" color="error" class="error-box pa-6">
     <h1 
  class="text-h2 font-weight-black mb-2 glitch-code" 
  :data-text="error.statusCode"
>
  {{ error.statusCode }}
</h1>
      <p class="text-subtitle-1 mb-4 text-uppercase letter-spacing-2">
        {{ error.message || 'Unknown kernel exception detected' }}
      </p>
      
      <div class="code-block pa-4 mb-6">
        <div class="text-caption opacity-70 mb-1">// DIAGNOSTIC_LOG:</div>
        <div class="text-body-2 text-error">
          THREAD_STUCK_IN_DEVICE_DRIVER: {{ $route.path }}
        </div>
      </div>

      <v-btn
        color="error"
        variant="tonal"
        prepend-icon="mdi-arrow-left"
        class="text-none"
        @click="handleClearError"
      >
        Reboot System
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
});

const handleClearError = () => {
  clearError({ redirect: '/' });
};
</script>

<style scoped lang="scss">
// 1. Import the math module at the very top
@use "sass:math";

.error-container {
  max-width: 500px;
  width: 100%;
}

.error-box {
  background-color: rgba(var(--v-theme-error), 0.02) !important;
  border: 1px dashed rgb(var(--v-theme-error)) !important;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(var(--v-theme-error), 0.05) 1px, 
      transparent 1px
    );
    background-size: 100% 4px;
    pointer-events: none;
  }
}

.code-block {
  background: rgba(0, 0, 0, 0.2);
  border-left: 3px solid rgb(var(--v-theme-error));
  font-family: 'Cascadia Code', monospace;
}

.letter-spacing-2 {
  letter-spacing: 2px;
}

/* Background Blueprint Grid */
:deep(.v-main) {
  --grid-color: rgba(var(--v-theme-error), 0.05);
  background-image: 
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 60px 60px;
}

.glitch-code {
  position: relative;
  display: inline-block;
  
  &::before, &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
  }

  &::before {
    left: 2px;
    text-shadow: -2px 0 rgb(var(--v-theme-primary));
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim 5s infinite linear alternate-reverse;
  }

  &::after {
    left: -2px;
    text-shadow: -2px 0 rgb(var(--v-theme-error));
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim 5s infinite linear alternate;
  }
}

// 2. Updated animation with modern Sass math
@keyframes glitch-anim {
  $steps: 20;
  @for $i from 0 through $steps {
    // Use math.percentage and math.div
    #{math.percentage($i * math.div(1, $steps))} {
      // Use math.random
      clip: rect(math.random(100) + px, 9999px, math.random(100) + px, 0);
      transform: skew(math.div(math.random(10), 100) + deg);
    }
  }
}
</style>