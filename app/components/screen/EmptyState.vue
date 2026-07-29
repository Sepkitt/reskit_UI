<template>
  <div class="empty-state-container" :class="{ 'is-desktop': !isMobile }">
    <div class="terminal-box">
      <div class="status-icon-wrapper">
        <v-icon color="primary" class="mb-4 status-icon">
          mdi-antenna
        </v-icon>
        <div class="pulse-ring"></div>
      </div>

      <h3 class="text-h6 font-weight-bold primary--text mb-1">
        NO_SIGNAL_DETECTED
      </h3>
      <p class="text-caption opacity-60 mb-6 terminal-font">
        Awaiting input source... <br />
        System status: [ {{ isMobile ? "MOBILE_STANDBY" : "DESKTOP_STANDBY" }} ]
      </p>

      <div class="diagnostic-grid">
        <div class="diag-item">
          <span>LATENCY</span><span class="dots"></span><span>{{ latency }}ms</span>
        </div>
        <div class="diag-item">
          <span>PACKET</span><span class="dots"></span><span>0/0</span>
        </div>
        <div class="diag-item">
          <span>ENCRYPT</span><span class="dots"></span><span>NULL</span>
        </div>
      </div>
    </div>
    <div class="blueprint-bg"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const props = defineProps({
  isMobile: { type: Boolean, default: false },
});

const latency = ref("--");
let interval = null;

onMounted(() => {
  interval = setInterval(() => {
    latency.value = Math.floor(Math.random() * (999 - 100) + 100);
  }, 2000);
});

onUnmounted(() => clearInterval(interval));
</script>

<style lang="scss" scoped>
.empty-state-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--v-theme-surface));
  z-index: 5;
  overflow: hidden;

  /* --- SHARED STYLES --- */
  .terminal-box {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    width: 100%;
    height: 100%;
    border: 1px solid rgba(var(--v-theme-primary), 0.3);
    background: rgba(var(--v-theme-surface), 0.8);
    backdrop-filter: blur(8px);
  }

  .status-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;

    .status-icon {
      font-size: 48px; // Mobile default
      z-index: 2;
    }

    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 2px solid rgb(var(--v-theme-primary));
      pointer-events: none;
      z-index: 1;
      // Default Mobile Pulse
      animation: mobile-pulse 2s infinite;
    }
  }

  .diagnostic-grid {
    margin-top: 20px;
    border-top: 1px solid rgba(var(--v-theme-primary), 0.1);
    padding-top: 15px;
    width: 100%;
    max-width: 200px;

    .diag-item {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: rgba(var(--v-theme-primary), 0.7);
      font-family: monospace;
      margin-bottom: 4px;
      .dots {
        flex-grow: 1;
        border-bottom: 1px dotted rgba(var(--v-theme-primary), 0.2);
        margin: 0 8px;
        position: relative;
        top: -4px;
      }
    }
  }

  /* --- DESKTOP SCALING --- */
  &.is-desktop {
    container-type: size;
    font-size: clamp(16px, 2cqi, 28px);

    .terminal-box { padding: 3em; }

    .status-icon-wrapper {
      margin-bottom: 2em;
      .status-icon { font-size: 5em !important; }
      .pulse-ring { animation: desktop-pulse 2s infinite; }
    }

    h3 { font-size: 1.8em !important; }
    p { font-size: 1.1em !important; }
    .diagnostic-grid {
      max-width: 20em;
      .diag-item { font-size: 0.8em; }
    }
  }

  .terminal-font {
    font-family: "Fira Code", monospace;
    letter-spacing: 1px;
    line-height: 1.5;
  }

  .blueprint-bg {
    position: absolute;
    inset: 0;
    opacity: 0.1;
    background-image:
      linear-gradient(rgba(var(--v-theme-primary), 0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(var(--v-theme-primary), 0.3) 1px, transparent 1px);
    background-size: 30px 30px;
  }
}

/* --- ANIMATIONS --- */
@keyframes mobile-pulse {
  0% { width: 40px; height: 40px; opacity: 0.8; }
  100% { width: 100px; height: 100px; opacity: 0; }
}

@keyframes desktop-pulse {
  0% { width: 2em; height: 2em; opacity: 0.8; }
  100% { width: 8em; height: 8em; opacity: 0; }
}
</style>