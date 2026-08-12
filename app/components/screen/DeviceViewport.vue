<template>
  <v-card
    class="d-flex fill-height flex-column rounded-lg overflow-hidden border-themed"
    color="surface"
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

        <ReskitMenuCard
          :title="`DIAGNOSTIC_FEED // ${getSimulatedLabel(device.width)}`"
          :items="diagnosticItems"
          :footerText="`STATUS: ${fps < 45 ? 'DEGRADED' : 'NOMINAL'}`"
        />
      </v-menu>

      <div class="simulated-label-container mr-2 py-2">
        <span class="text-uppercase font-weight-bold text-caption text-primary">
          {{ getSimulatedLabel(device.width) }}
        </span>
      </div>

      <v-spacer />

      <DeviceSelect
        ref="selectFrame"
        v-if="frameNo === 1"
        :model-value="device"
        @update:model-value="onDeviceChange"
        :items="items"
      />

      <v-menu offset="10">
        <template v-slot:activator="{ isActive, props }">
          <v-btn
            :append-icon="isActive ? 'mdi-menu-up' : 'mdi-menu-down'"
            height="40px"
            v-bind="props"
            :class="menuStatusText"
            class="rounded-lg tooltip-btn mx-2"
            size="small"
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
        <ReskitMenuCard
          title="Network Throtteling"
          :items="menuItems"
          @itemClick="setNetwork"
        />
      </v-menu>

      <v-btn
        :icon="
          rotate ? 'mdi-phone-rotate-landscape' : 'mdi-phone-rotate-portrait'
        "
        class="rounded-lg tooltip-primary tooltip-btn"
        size="small"
        variant="tonal"
        :color="'primary'"
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
        @navigation="$emit('navigate', $event)"
      >
        <template #content>
          <v-slider
            :model-value="zoom"
            @update:model-value="$emit('update:zoom', $event)"
            max="3"
            min="0"
            step="0.1"
            density="compact"
            color="primary"
            direction="vertical"
            hide-details
            thumb-color="accent"
            track-color="background"
            class="zoom-slider-ui my-1"
          >
            <template #append>
              <TooltipButton
                text="Zoom In"
                icon="mdi-magnify-plus-outline"
                size="small"
                variant="tonal"
                color="primary"
                @click="$emit('update:zoom', Math.min(zoom + 0.5, 3))"
              />
            </template>
            <template #prepend>
              <TooltipButton
                icon="mdi-magnify-minus-outline"
                text="Zoom out"
                size="small"
                variant="tonal"
                color="primary"
                :disabled="zoom <= 0.4"
                @click="$emit('update:zoom', Math.min(zoom - 0.5, 3))"
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

const emit = defineEmits(["update:device", "update:zoom", "update:rotate", "navigate"]);

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

// DiagnosticFeedback items
const diagnosticItems = computed(() => {
  return [
    {
      label: "RENDERING",
      value: `${fps.value}FPS`,
      itemClass: fps.value < 45 ? "text-error" : "text-primary",
    },
    {
      label: "NET_LOAD",
      value: `${loadTime.value}ms`,
      itemClass: "",
    },
    {
      label: "JS_HEAP",
      value: `${memoryUsage.value}MB`,
      itemClass: "",
    },
  ];
});

// NETWORK STATUS
const networkStatus = ref("online");
const isThrottling = ref(false);

const menuStatusText = computed(() => {
  switch (networkStatus.value) {
    case "online":
      return "tooltip-success";
    case "slow":
      return "tooltip-warning";
    case "offline":
      return "tooltip-error";
    default:
      "tooltip-primary";
      break;
  }
  // networkStatus === 'online' ? 'tooltip-success' : ''
});

const setNetwork = (status) => {
  networkStatus.value = status;
  // If we change status, we reset the load timer to simulate a fresh request
  loadStart.value = performance.now();
  console.log("Network set to:", status);

  // OPTIONAL: If you want to force the iframe to reload to see the "slow" effect:
  // Note: This requires a ref on the Device component
  // deviceRef.value?.reload();
};

// network throtteling menu
const menuItems = computed(() => {
  return [
    { label: "ONLINE", value: "NO LIMIT", clickable: true, action: "online" },
    {
      label: "SLOW",
      value: " 400ms",
      clickable: true,
      action: "slow",
      itemClass: "text-warning",
    },
    {
      label: "OFFLINE",
      value: "DISCONNECT",
      clickable: true,
      action: "offline",
      itemClass: "text-error",
    },
  ];
});

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

const BREAKPOINTS = [
  { min: 2560, name: "xxl" },
  { min: 1920, name: "xl" },
  { min: 1280, name: "lg" },
  { min: 960, name: "md" },
  { min: 600, name: "sm" },
  { min: 0, name: "xs" },
];

const getSimulatedLabel = (width) => {
  const w = Number(width);
  return BREAKPOINTS.find((bp) => w >= bp.min)?.name ?? "xs";
};
</script>

<style scoped lang="scss">
.v-list-item--density-compact:not(.v-list-item--nav).v-list-item--one-line {
  &:hover {
    border-top: 0.2px solid var(--t-color);
    border-bottom: 0.2px solid var(--t-color);

    box-shadow: inset 0 2px 6px 0 rgb(var(--v-theme-background));
    background-color: rgb(var(--t-color));
    color: var(--t-color) !important;
  }
}
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
    border-radius: 2px;
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
  height: 40px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
  box-shadow: inset 0 2px 6px 0 rgb(var(--v-theme-background));
  background-color: rgb(var(--v-theme-primary), 0.1);
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
  height: 40px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid rgba(var(--v-theme-primary), 0.5);
  background-color: rgb(var(--v-theme-primary), 0.1);
  box-shadow: inset 0 2px 6px 0 rgb(var(--v-theme-background));
}

.v-theme--darkTheme .simulated-label-container {
  box-shadow: inset 0 2px 6px 0 rgb(var(--v-theme-background));
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
