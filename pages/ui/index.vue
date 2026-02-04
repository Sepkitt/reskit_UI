<script setup>
import QrcodeVue from "qrcode.vue";
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";

import {
  phones,
  tablets,
  laptops,
  televisions,
  TYPES,
} from "~/assets/devices.json";

const { isDark, toggleTheme, themeColor } = useMyTheme();

// 1. Reactive State
const { name: currentBreakpoint } = useDisplay();
const url = ref("https://nuxtjs.org/");
const src = ref("https://nuxtjs.org/");
const dialog = ref(false);
const showShells = ref(true);

const display = useDisplay();
const isHydrated = ref(false);

onMounted(() => {
  isHydrated.value = true;
});

const lgAndUpDevices = [...laptops, ...televisions];
const mdAndDownDevices = [...phones, ...tablets];

const devices = ref([
  {
    id: 1,
    rotate: false,
    xl: 7,
    lg: 8,
    zoom: 0, // Initialize zoom
    items: lgAndUpDevices,
    breakpoint: lgAndUpDevices[3],
  },
  {
    id: 2,
    rotate: false,
    xl: 5,
    lg: 4,
    zoom: 0, // Initialize zoom
    items: mdAndDownDevices,
    breakpoint: mdAndDownDevices[6],
  },
]);

// 2. Constants for Layout (Replacing the cardSizes switch)
const cardSizeMap = {
  xs: "86vh",
  sm: "86vh",
  md: "600px",
  lg: "86vh",
  xl: "90vh",
};

const maxHeight = computed(() => {
  // On server/first load, use a fixed default.
  // Once hydrated, use the real breakpoint.
  if (!isHydrated.value) return "86vh";
  return cardSizeMap[display.name.value] || "86vh";
});

// 3. Helper: Identify current simulated size label
const getSimulatedLabel = (width) => {
  const w = Number(width);
  if (w >= 3840) return "4k";
  if (w >= 2560) return "2k/qhd";
  if (w >= 1904) return "xl";
  if (w >= 1264) return "lg";
  if (w >= 960) return "md";
  if (w >= 600) return "sm";
  return "xs";
};

const updateSrc = () => {
  // Simple validation to prepend https if missing
  let target = url.value.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = "https://" + target;
    url.value = target;
  }
  src.value = target;
};
</script>

<template>
  <div>
    <v-app-bar
      color="background"
      elevation="0"
      class="border-b"
      :style="{ borderColor: 'rgb(var(--v-theme-outline)) !important' }"
    >
      <v-toolbar-title class="text-primary font-weight-black letter-spacing-1">
        RES<span class="text-text">KIT</span>
      </v-toolbar-title>

      <v-spacer />

      <v-text-field
        v-model="url"
        density="compact"
        variant="solo-filled"
        flat
        bg-color="surface-variant"
        placeholder="Enter URL..."
        hide-details
        class="url-bar-refined"
        @keyup.enter="updateSrc"
      >
        <template #prepend-inner>
          <v-icon size="small" color="primary" class="mr-1"
            >mdi-link-variant</v-icon
          >
        </template>

        <template #append-inner>
          <v-fade-transition>
            <v-icon
              v-if="url"
              size="x-small"
              color="grey"
              class="cursor-pointer"
              @click="url = ''"
            >
              mdi-close-circle
            </v-icon>
          </v-fade-transition>
        </template>
      </v-text-field>

      <v-btn
        color="primary"
        variant="elevated"
        elevation="1"
        class="ml-2 px-6 update-btn-refined"
        height="40"
        @click="updateSrc"
      >
        <v-icon start size="small">mdi-refresh</v-icon>
        Update
      </v-btn>

      <v-spacer />

      <v-btn
        icon
        size="small"
        variant="text"
        class="mr-2"
        @click="dialog = true"
      >
        <v-icon>mdi-qrcode</v-icon>
      </v-btn>

         <TooltipButton
         size="small"
         variant="tonal"
        color="primary"
        :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
        :text="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"


        @click="toggleTheme"
      />
    </v-app-bar>

    <v-container fluid class="fill-height bg-darkness pa-0">
      <v-row no-gutters class="fill-height">
        <v-col
          v-for="device in devices"
          :key="device.id"
          class="pa-2"
          cols="12"
          :lg="device.lg"
          :xl="device.xl"
        >
          <v-card
            :height="maxHeight"
            class="d-flex flex-column rounded-lg overflow-hidden border-themed"
            color="background"
            elevation="0"
          >
            <v-toolbar color="surface" density="compact" class="border-b px-2">
              <div class="simulated-label-container mr-2">
                <ClientOnly>
                  <span class="label-text">
                    {{ getSimulatedLabel(device.breakpoint.width) }}
                  </span>
                  <template #fallback>
                    <span class="label-text">...</span>
                  </template>
                </ClientOnly>
              </div>

              <v-spacer />

              <v-select
                v-model="device.breakpoint"
                :items="device.items"
                item-title="name"
                return-object
                density="compact"
                variant="outlined"
                hide-details
                class="select-width-refined mx-4"
              >
                <template #selection="{ item }">
                  <div class="d-flex align-center">
                    <span
                      class="text-caption font-weight-bold text-primary mr-2"
                    >
                      {{ getSimulatedLabel(item.raw.width) }}
                    </span>
                    <span class="text-caption font-weight-medium">
                      {{ item.raw.name }}
                    </span>
                  </div>
                </template>

                <template #item="{ props, item }">
                  <v-list-item v-bind="props" class="device-list-item">
                    <template #title>
                      <div
                        class="d-flex align-center justify-space-between w-100"
                      >
                        <span class="text-body-2 font-weight-medium">{{
                          item.raw.name
                        }}</span>

                        <div class="mini-label-badge ml-4">
                          {{ getSimulatedLabel(item.raw.width) }}
                        </div>
                      </div>
                    </template>

                    <template #subtitle>
                      <span class="text-grey-darken-1"
                        >{{ item.raw.width }} x {{ item.raw.height }}</span
                      >
                    </template>
                  </v-list-item>
                </template>
              </v-select>

              <v-btn
                :icon="
                  device.rotate
                    ? 'mdi-phone-rotate-landscape'
                    : 'mdi-phone-rotate-portrait'
                "
                size="small"
                variant="text"
                :color="device.rotate ? 'primary' : 'default'"
                @click="device.rotate = !device.rotate"
              />
            </v-toolbar>

            <div class="device-viewport-container blueprint-grid">
              <Device
                v-model:zoom="device.zoom"
                :height="
                  device.rotate
                    ? device.breakpoint.width
                    : device.breakpoint.height
                "
                :width="
                  device.rotate
                    ? device.breakpoint.height
                    : device.breakpoint.width
                "
                :device="device.breakpoint"
                :src="src"
                :show-browser-ui="showShells"
              >
                <template #content>
                  <v-slider
                    v-model="device.zoom"
                    append-icon="mdi-magnify-plus-outline"
                    @click:append="device.zoom = Math.min(device.zoom + 1, 3)"
                    max="3"
                    step="1"
                    tick-size="4"
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
                        @click="device.zoom = 0"
                      />
                    </template>
                  </v-slider>
                </template>
              </Device>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.sheet {
  border: solid 1px #416ba2;
  height: 40px;
  border-radius: 5px;
  -moz-box-shadow: inset 0 0 10px #00000021;
  -webkit-box-shadow: inset 0 0 10px #00000021;
  box-shadow: inset 0 0 10px #0000004f;
}

.qr-placeholder {
  width: 200px;
  height: 200px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
}

.select-width {
  :deep(.v-field__input) {
    font-size: 0.8rem;
    padding-top: 4px;
    padding-bottom: 4px;
  }
}

.device-viewport-container {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  // Use the 'outline' color you defined in your plugin!
  --t-color: v-bind("themeColor('outline')");

  background-color: v-bind("themeColor('baseCard')");

  background-image:
    linear-gradient(var(--t-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--t-color) 1px, transparent 1px);
  background-size: 40px 40px; // Larger grid for a "blueprint" look
}

// 4. Re-use your existing mapping to switch the grid theme dynamically
.grid-primary {
  --t-color: rgb(var(--v-theme-primary));
}
.grid-accent {
  --t-color: rgb(var(--v-theme-accent));
}
.grid-success {
  --t-color: rgb(var(--v-theme-success));
}
.grid-info {
  --t-color: rgb(var(--v-theme-info));
}
.grid-tertiary {
  --t-color: rgb(var(--v-theme-tertiary));
}

.cursor-pointer {
  cursor: pointer;
}

/* Custom Scrollbar for the list */
:deep(.v-list) {
  max-height: 400px;
}

.url-bar-refined {
  max-width: 500px;

  :deep(.v-field) {
    border-radius: 8px !important;
    font-size: 0.9rem;
    // Add a very subtle border so it doesn't disappear in light mode
    border: 1px solid rgba(var(--v-theme-outline), 0.2);
  }

  :deep(.v-field__input) {
    // This ensures the text uses the theme's text color specifically
    color: rgb(var(--v-theme-text)) !important;
    opacity: 1 !important;
  }
}

.update-btn-refined {
  border-radius: 8px !important; // Match the text-field's radius
  text-transform: none !important; // Keeps it looking modern/web-standard
  font-weight: 600 !important;
  letter-spacing: 0.5px;

  // Optional: Add a subtle glow in dark mode
  &:hover {
    box-shadow: 0 0 12px rgba(var(--v-theme-primary), 0.3) !important;
  }
}

.simulated-label-container {
  display: flex;
  align-items: center;
  justify-content: center;

  // Sizing
  min-width: 48px;
  height: 28px;
  padding: 0 10px;
  border-radius: 4px;

  // Colors & Inset Shadow
  // Uses your blueprint primary blue for the border
  border: 1px solid rgba(var(--v-theme-primary), 0.5);
  background-color: rgb(var(--v-theme-surface));

  // The "Inset" look you liked, refined for modern UI
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.15);

  .label-text {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgb(var(--v-theme-primary));
  }
}

// Optional: Change the background in Dark Mode to be slightly deeper
.v-theme--darkTheme .simulated-label-container {
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 2px 6px 0 rgba(0, 0, 0, 0.5);
}
</style>
