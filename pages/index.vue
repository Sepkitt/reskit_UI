<template>
  <v-sheet
    class="blueprint-landing overflow-hidden locked-viewport"
    color="background"
    @mousemove="handleMouseMove"
  >
    <v-fade-transition>
      <div v-if="isWarmingUp" class="entry-mask">
        <div class="glitch-text" data-text="SYSTEM_READY">SYSTEM_READY</div>
      </div>
    </v-fade-transition>
    <div class="blueprint-grid-overlay"></div>

    <template v-if="isMounted">
      <div class="coordinates-x" :style="parallaxStyle">
        <span v-for="n in 15" :key="'x' + n">{{ (n - 1) * 100 }}</span>
      </div>
      <div class="coordinates-y" :style="parallaxStyle">
        <span v-for="n in 15" :key="'y' + n">{{ (n - 1) * 100 }}</span>
      </div>

      <div class="center-ruler d-none d-md-flex">
        <div class="ruler-line"></div>
        <div class="ruler-measurements">
          <span v-for="i in 6" :key="i" class="font-mono">{{ i * 150 }}ms</span>
        </div>
        <div class="ruler-line"></div>
      </div>

      <v-container
        class="fill-height position-relative"
        style="z-index: 2"
        fluid
      >
        <v-row
          align="center"
          justify="space-between"
          class="fill-height px-md-16"
        >
          <v-col cols="12" md="5" lg="4" order="2" order-md="1">
            <v-fade-transition appear>
              <div :class="{ 'text-center': mobile }">
                <div
                  class="text-overline text-primary font-weight-bold mb-1 letter-spacing-2"
                >
                  PROJECT_RESKIT // UNIT_01
                </div>

                <h1 class="text-h1 font-weight-black mb-2 main-title">
                  RES<span class="text-primary">KIT</span>
                </h1>

                <div
                  class="d-flex align-center mb-6 justify-center justify-md-start"
                >
                  <span class="version-tag">v2.0.4-BETA</span>
                  <span
                    class="text-caption text-grey ml-4 font-mono opacity-50"
                  >
                    INIT_ID: {{ mouseCoord }}
                  </span>
                </div>

                <h2
                  class="text-h6 text-grey font-weight-light mb-10 landing-subtitle"
                >
                  An expansive
                  <span class="text-primary font-weight-medium"
                    >blueprint environment</span
                  >
                  designed for precision device simulation and high-fidelity
                  validation.
                </h2>

                <v-btn
                  size="x-large"
                  flat
                  class="px-10 init-btn"
                  @click="startInitialization"
                >
                  Initialize System
                  <v-icon end size="small">mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </v-fade-transition>
          </v-col>

          <v-col
            cols="12"
            md="5"
            lg="5"
            class="d-flex justify-center justify-md-end position-relative"
            order="1"
            order-md="2"
          >
            <div class="logo-blueprint-frame hover-blueprint">
              <div class="crosshair ch-tl"></div>
              <div class="crosshair ch-tr"></div>
              <div class="crosshair ch-bl"></div>
              <div class="crosshair ch-br"></div>

              <ReskitLogo :size="dynamicLogoSize" />

              <div class="data-label">
                <div class="text-caption font-weight-black">
                  OBJ_REF: UI_GLOBAL
                </div>
                <div class="text-caption opacity-60">
                  XY_POS: {{ mouseCoord }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <div v-else class="pre-mount-loader d-flex align-center justify-center">
      <div class="loader-content text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="2"
        />
        <div class="mt-4 font-mono text-primary text-caption">
          CALIBRATING_VIEWPORT...
        </div>
      </div>
    </div>

    <v-overlay
      v-model="isInitializing"
      persistent
      class="align-center justify-center boot-overlay"
      scrim="black"
    >
      <div class="terminal-loader">
        <div class="blueprint-scanner"></div>

        <div
          class="terminal-header d-flex justify-space-between font-mono mb-2"
        >
          <span class="text-primary">SECURE_BOOT_V2</span>
          <span class="text-primary">{{ bootPercent }}%</span>
        </div>

        <div class="logs font-mono">
          <div v-for="(log, i) in bootLogs" :key="i" class="log-line">
            <span class="text-primary">></span> {{ log }}
          </div>
          <div v-if="bootLogs.length > 0" class="cursor">_</div>
        </div>
      </div>
    </v-overlay>
  </v-sheet>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useDisplay } from "vuetify";

definePageMeta({ layout: "home" });

const { mobile, name: currentBreakpoint } = useDisplay();
const isWarmingUp = ref(true);

// The Hydration Guard
const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
  // Give the browser 500ms to paint the blueprint grid
  // then fade out the "warming up" mask
  setTimeout(() => {
    isWarmingUp.value = false;
  }, 800);
});

// Interactivity States
const mouseX = ref(0);
const mouseY = ref(0);
const mouseCoord = computed(
  () => `${Math.round(mouseX.value)},${Math.round(mouseY.value)}`,
);

const handleMouseMove = (e) => {
  mouseX.value = e.clientX / 60;
  mouseY.value = e.clientY / 60;
};

const parallaxStyle = computed(() => ({
  transform: `translate(${mouseX.value}px, ${mouseY.value}px)`,
}));

const dynamicLogoSize = computed(() => {
  if (mobile.value) return 220;
  if (currentBreakpoint.value === "xl") return 480;
  return 380;
});

// Initialization Logic
const isInitializing = ref(false);
const bootLogs = ref([]);
const logOptions = [
  "CHECKING_DEVICE_CONFIG...",
  "LOADING_BREAKPOINTS...",
  "MOUNTING_VIEWPORT_SHELLS...",
  "ESTABLISHING_VUE_REACTIVE_PROPS...",
  "INITIALIZING_RESKIT_CORE_V2...",
];

const bootPercent = ref(0);

const startInitialization = async () => {
  isInitializing.value = true;
  bootLogs.value = [];
  bootPercent.value = 0;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < logOptions.length; i++) {
    const randomDelay = Math.floor(Math.random() * 450) + 150;
    await wait(randomDelay);

    bootLogs.value.push(logOptions[i]);

    // Increment percent based on progress through logs
    bootPercent.value = Math.floor(((i + 1) / logOptions.length) * 100);

    if (i === logOptions.length - 1) {
      await wait(800);
      navigateTo("/UI");
    }
  }
};
</script>

<style lang="scss" scoped>
// Fixed Styles move from inline to class to avoid Hydration Mismatch
.locked-viewport {
  position: fixed !important;
  width: 100vw !important;
  height: 100dvh !important;
  top: 0 !important;
  left: 0 !important;
}

.blueprint-landing {
  position: relative;
  background-image:
    linear-gradient(rgba(var(--v-theme-primary), 0.08) 1px, transparent 1px),
    linear-gradient(
      90deg,
      rgba(var(--v-theme-primary), 0.08) 1px,
      transparent 1px
    );
  background-size: 60px 60px;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 50%,
      transparent 0%,
      rgb(var(--v-theme-background)) 85%
    );
    pointer-events: none;
  }
}

.center-ruler {
  position: absolute;
  left: 50%;
  top: 10%;
  bottom: 10%;
  transform: translateX(-50%);
  flex-direction: column;
  align-items: center;
  opacity: 0.15;
  pointer-events: none;
  z-index: 1;

  .ruler-line {
    width: 1px;
    flex-grow: 1;
    background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--v-theme-primary)),
      transparent
    );
  }

  .ruler-measurements {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 60%;
    padding: 20px 0;
    font-size: 10px;
    color: rgb(var(--v-theme-primary));
    span {
      display: block;
      transform: rotate(-90deg);
      white-space: nowrap;
      text-align: center;
      width: 50px;
      margin: 30px 0;
    }
  }
}

.coordinates-x,
.coordinates-y {
  position: absolute;
  display: flex;
  font-family: monospace;
  font-size: 10px;
  color: rgb(var(--v-theme-primary));
  opacity: 0.2;
  pointer-events: none;
  transition: transform 0.1s ease-out;
  white-space: nowrap;
}
.coordinates-x {
  top: 15px;
  left: 15px;
  right: 15px;
  justify-content: space-between;
}
.coordinates-y {
  left: 15px;
  top: 15px;
  bottom: 15px;
  flex-direction: column;
  justify-content: space-between;
}

.logo-blueprint-frame {
  position: relative;
  padding: 60px;
  .crosshair {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 1px solid rgb(var(--v-theme-primary));
  }
  .ch-tl {
    top: 0;
    left: 0;
    border-right: 0;
    border-bottom: 0;
  }
  .ch-tr {
    top: 0;
    right: 0;
    border-left: 0;
    border-bottom: 0;
  }
  .ch-bl {
    bottom: 0;
    left: 0;
    border-right: 0;
    border-top: 0;
  }
  .ch-br {
    bottom: 0;
    right: 0;
    border-left: 0;
    border-top: 0;
  }
}

.data-label {
  position: absolute;
  bottom: -10px;
  right: 30px;
  border-left: 2px solid rgb(var(--v-theme-primary));
  padding-left: 10px;
  color: rgb(var(--v-theme-primary));
  font-family: monospace;
}

.main-title {
  letter-spacing: -3px !important;
  line-height: 0.9;
}
.version-tag {
  font-size: 10px;
  font-weight: 900;
  padding: 2px 8px;
  border: 1px solid rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
  border-radius: 4px;
}

.init-btn {
  --t-color: rgb(var(--v-theme-primary));
  background-color: color-mix(
    in srgb,
    var(--t-color),
    rgb(var(--v-theme-surface)) 85%
  ) !important;
  color: var(--t-color) !important;
  border: 1px solid var(--t-color) !important;
  border-radius: 4px !important;
  text-transform: none !important;
  font-weight: 800;
  transition: all 0.3s ease;
  &:hover {
    background-color: color-mix(
      in srgb,
      var(--t-color),
      rgb(var(--v-theme-surface)) 70%
    ) !important;
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(var(--v-theme-primary), 0.25) !important;
  }
}

.hover-blueprint {
  animation: floatCalibrate 10s infinite ease-in-out;
}
@keyframes floatCalibrate {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(10px, -15px) rotate(1deg);
  }
}
.boot-overlay {
  backdrop-filter: blur(12px);
}
.terminal-loader {
  width: 450px;
  background: rgba(var(--v-theme-surface), 0.8);
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
  padding: 20px;
  position: relative;
  backdrop-filter: blur(10px);
  .terminal-header {
    font-size: 10px;
    letter-spacing: 2px;
    border-bottom: 1px solid rgba(var(--v-theme-primary), 0.2);
    padding-bottom: 8px;
  }

  .logs {
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
  }
  .blueprint-scanner {
    width: 100%;
    height: 2px;
    background: rgb(var(--v-theme-primary));
    box-shadow: 0 0 20px rgb(var(--v-theme-primary));
    position: absolute;
    top: 0;
    animation: scan 2s infinite linear;
    z-index: 2;
  }
}
.log-line {
  font-size: 0.8rem;
  color: #fff;
  margin-bottom: 6px;
  font-family: monospace;
}
.cursor {
  display: inline-block;
  width: 8px;
  height: 15px;
  background: white;
  animation: blink 0.8s infinite;
  vertical-align: middle;
}
@keyframes scan {
  0% {
    top: -20px;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    top: 200px;
    opacity: 0;
  }
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
.font-mono {
  font-family: monospace !important;
}
.letter-spacing-2 {
  letter-spacing: 2px !important;
}

.entry-mask {
  position: fixed;
  inset: 0;
  background: rgb(var(--v-theme-background));
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glitch-text {
  font-family: monospace;
  font-size: 1.5rem;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));
  position: relative;
  letter-spacing: 10px;

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }

  &::before {
    color: #ff00ff;
    z-index: -1;
    animation: glitch-anim 0.3s infinite;
  }

  &::after {
    color: #00ffff;
    z-index: -2;
    animation: glitch-anim 0.3s infinite reverse;
  }
}

@keyframes glitch-anim {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-3px, 3px);
  }
  40% {
    transform: translate(-3px, -3px);
  }
  60% {
    transform: translate(3px, 3px);
  }
  80% {
    transform: translate(3px, -3px);
  }
  100% {
    transform: translate(0);
  }
}
</style>
