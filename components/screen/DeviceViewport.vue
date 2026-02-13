<template>
  <v-card
    :height="maxHeight"
    class="d-flex flex-column rounded-lg overflow-hidden border-themed"
    color="background"
    elevation="0"
  >
    <v-toolbar color="surface" density="compact" class="border-b pa-1">
      <v-menu
        :close-on-content-click="false"
        location="bottom start"
        offset="10"
      >
        <template v-slot:activator="{ props: menu }">
          <v-tooltip
            :content-class="`custom-themed-tooltip tooltip-primary`"
            :offset="5"
            location="left"
          >
            <template v-slot:activator="{ props: tooltip }">
              <div
                v-bind="mergeProps(menu, tooltip)"
                class="status-led-trigger mr-2"
              >
                <div class="mini-wave-container">
                  <svg viewBox="0 0 60 20" class="mini-wave-svg">
                    <path
                      :d="miniWavePath"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      class="text-primary"
                    />
                  </svg>
                </div>
                <div
                  class="status-led"
                  :class="fps < 45 ? 'led-error' : 'led-active'"
                ></div>
              </div>
            </template>
            <span class="text-primary">
              <v-icon class="text-primary-lighten-1 mx-2" size="small"
                >mdi-pulse</v-icon
              >
              {{ fps }} FPS // SYSTEM_HEALTH
            </span>
          </v-tooltip>
        </template>

        <ReskitDiagnosticFeed
          :label="getSimulatedLabel(device.width)"
          :load-time="loadTime"
          :fps="fps"
          :memory="memoryUsage"
        />
      </v-menu>

      <div class="simulated-label-container mr-2 py-2">
        <span class="text-uppercase font-weight-bold text-caption text-primary">
          {{ getSimulatedLabel(device.width) }}
        </span>
      </div>

      <v-spacer />

      <DeviceSelect
        v-if="frameNo === 1"
        :model-value="device"
        @update:model-value="onDeviceChange"
        :items="items"
      />

      <v-menu offset="10">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            size="small"
            :color="networkStatus === 'online' ? 'default' : 'warning'"
            class="text-caption"
          >
            <v-icon start size="small">
              {{
                networkStatus === "online"
                  ? "mdi-wifi"
                  : networkStatus === "offline"
                    ? "mdi-wifi-off"
                    : "mdi-speedometer-slow"
              }}
            </v-icon>
            {{ networkStatus.toUpperCase() }}
          </v-btn>
        </template>
        <v-list density="compact" class="font-mono" bg-color="surface">
          <v-list-item
            @click="setNetwork('online')"
            title="ONLINE (NO LIMIT)"
          />
          <v-list-item
            @click="setNetwork('slow')"
            title="SLOW 3G (LATENCY: 400ms)"
          />
          <v-list-item
            @click="setNetwork('offline')"
            title="OFFLINE (DISCONNECT)"
          />
        </v-list>
      </v-menu>

      <v-btn
        :icon="
          rotate ? 'mdi-phone-rotate-landscape' : 'mdi-phone-rotate-portrait'
        "
        size="small"
        variant="text"
        :color="rotate ? 'primary' : 'default'"
        @click="$emit('update:rotate', !rotate)"
      />

      <template #extension v-if="frameNo === 2">
        <v-spacer></v-spacer>
        <DeviceSelect
          :model-value="device"
          @update:model-value="onDeviceChange"
          :items="items"
        />
      </template>
    </v-toolbar>

    <div class="device-viewport-container blueprint-grid">
      <v-fade-transition>
        <div v-if="networkStatus !== 'online'" class="network-alert-badge">
          {{
            networkStatus === "offline"
              ? "CONNECTION_LOST"
              : "THROTTLING_ACTIVE"
          }}
        </div>
      </v-fade-transition>
      <Device
        class="device-transition"
        :zoom="zoom"
        @update:zoom="$emit('update:zoom', $event)"
        :height="rotate ? device.width : device.height"
        :width="rotate ? device.height : device.width"
        :device="device"
        :src="activeSrc"
        show-browser-ui
        @load="onIframeLoad"
      >
        <template #content>
          <div v-if="zoom > 0" class="zoom-percentage-hud">
    {{ Math.round((zoom + 1) * 100) }}%
  </div>
          <v-slider
            :model-value="zoom"
            @update:model-value="$emit('update:zoom', $event)"
            append-icon="mdi-magnify-plus-outline"
            @click:append="$emit('update:zoom', Math.min(zoom + 0.5, 3))"
            max="3"
            min="0"
            step="0.1"
            density="compact"
            color="primary"
            direction="vertical"
            hide-details
            class="zoom-slider-ui"
          >
            <template #prepend>
              <v-btn
                icon="mdi-fit-to-screen"
                size="x-small"
                variant="flat"
                color="background"
                @click="$emit('update:zoom', 0)"
              />
            </template>
          </v-slider>
        </template>
      </Device>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, mergeProps } from "vue";

const props = defineProps({
  device: Object,
  items: Array,
  zoom: Number,
  rotate: Boolean,
  src: String,
  maxHeight: String,
  frameNo: Number,
});

const emit = defineEmits(["update:device", "update:zoom", "update:rotate"]);

const activeSrc = computed(() => {
  return networkStatus.value === "offline" ? "about:blank" : props.src;
});

// PERFORMANCE LOGIC
const fps = ref(60);
const memoryUsage = ref(0);
const loadTime = ref(0);
const loadStart = ref(0);
const miniWavePath = ref("");
const deltaHistory = ref([]);

let frameCount = 0;
let lastTime = performance.now();
let lastSecondTimestamp = performance.now();
let rafId = null;

const updateWaveform = (delta) => {
  deltaHistory.value.push(delta);
  if (deltaHistory.value.length > 30) deltaHistory.value.shift();

  const points = deltaHistory.value.map((d, i) => {
    const x = (i / 29) * 60;
    // Normalized wave: 16.6ms (60fps) sits in the middle
    const y = 10 + (d - 16.6) * 0.8;
    const clampedY = Math.max(2, Math.min(18, y));
    return `${x},${clampedY}`;
  });
  miniWavePath.value = points.length > 1 ? `M ${points.join(" L ")}` : "";
};
let frameSkipCounter = 0;

const trackPerformance = () => {
  const now = performance.now();
  const delta = now - lastTime;

  // SLOW DOWN THE WAVE: Only update every 4 frames
  frameSkipCounter++;
  if (frameSkipCounter >= 4) {
    updateWaveform(delta);
    frameSkipCounter = 0;
  }
  frameCount++;

  if (now >= lastSecondTimestamp + 1000) {
    fps.value = Math.round((frameCount * 1000) / (now - lastSecondTimestamp));
    if (window.performance?.memory) {
      memoryUsage.value = Math.round(
        performance.memory.usedJSHeapSize / (1024 * 1024),
      );
    }
    frameCount = 0;
    lastSecondTimestamp = now;
  }

  lastTime = now;
  rafId = requestAnimationFrame(trackPerformance);
};

const onDeviceChange = (newDevice) => {
  loadStart.value = performance.now();
  emit("update:device", newDevice);
};

// NETWORK STATUS
const networkStatus = ref("online");
const isThrottling = ref(false);

const setNetwork = (status) => {
  networkStatus.value = status;
  // If we change status, we reset the load timer to simulate a fresh request
  loadStart.value = performance.now();

  // OPTIONAL: If you want to force the iframe to reload to see the "slow" effect:
  // Note: This requires a ref on the Device component
  // deviceRef.value?.reload();
};

const onIframeLoad = () => {
  let delay = 0;
  if (networkStatus.value === "slow") delay = 400; // Simulate 400ms handshake/latency
  isThrottling.value = true;

  setTimeout(() => {
    if (loadStart.value > 0) {
      loadTime.value = Math.round(performance.now() - loadStart.value) + delay;
    }
    isThrottling.value = false;
  }, delay);
};

onMounted(() => {
  rafId = requestAnimationFrame(trackPerformance);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
});

const getSimulatedLabel = (width) => {
  const w = Number(width);
  if (w >= 3840) return "4k";
  if (w >= 2560) return "2k";
  if (w >= 1904) return "xl";
  if (w >= 1264) return "lg";
  if (w >= 960) return "md";
  if (w >= 600) return "sm";
  return "xs";
};
</script>

<style scoped lang="scss">
.device-viewport-container {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  background-color: rgb(var(--v-theme-baseCard));
  --grid-color: rgba(var(--v-theme-outline), 0.15);
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 40px 40px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid rgb(var(--v-theme-primary));
    pointer-events: none;
    z-index: 5;
  }
  &::before {
    top: 10px;
    left: 10px;
    border-right: 0;
    border-bottom: 0;
  }
  &::after {
    bottom: 10px;
    right: 10px;
    border-left: 0;
    border-top: 0;
  }
}

.status-led-trigger {
  cursor: pointer;
  height: 28px;
  padding: 0 10px;
  border-radius: 4px;
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
  background: rgba(var(--v-theme-surface), 0.5);
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(var(--v-theme-primary), 0.1);
  }
}

.mini-wave-container {
  width: 50px;
  height: 14px;
  overflow: hidden;
}

.mini-wave-svg {
  width: 100%;
  height: 100%;
  display: block;
  filter: drop-shadow(0 0 2px rgba(var(--v-theme-primary), 0.4));
  transition: d 0.2s ease; /* Smooths the transition between point updates */
}

.status-led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #333;
  flex-shrink: 0;

  &.led-active {
    background: #00ff88;
    box-shadow: 0 0 8px #00ff8866;
  }
  &.led-error {
    background: rgb(var(--v-theme-error));
    box-shadow: 0 0 12px rgba(var(--v-theme-error), 0.6);
  }
}

.device-transition {
  transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1) !important;
  will-change: width, height, transform;
}

.simulated-label-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 28px;
  padding: 0 10px;
  border-radius: 4px;
  border: 1px solid rgba(var(--v-theme-primary), 0.5);
  background-color: rgb(var(--v-theme-surface));
}

.v-theme--darkTheme .simulated-label-container {
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 2px 6px 0 rgba(0, 0, 0, 0.5);
}

.zoom-slider-ui {
  z-index: 30;

}

.network-alert-badge {
  position: absolute;
  top: 15px;
  left: 14px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: bold;
  z-index: 10;
  border-radius: 2px;
  pointer-events: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  background-color: color-mix(
    in srgb,
    rgb(var(--v-theme-warning)),
    rgb(var(--v-theme-surface)) 50%
  );
  color: rgb(var(--v-theme-warning));
  border: 1px solid rgb(var(--v-theme-warning));
}
</style>
