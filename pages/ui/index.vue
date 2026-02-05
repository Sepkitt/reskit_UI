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
      :style="{ borderColor: 'primary' }"
      ><ReskitLogo :size="40" />
      <v-toolbar-title class="text-primary font-weight-black letter-spacing-1">
        RES<span class="text-text">KIT</span>
        <span class="text-overline">V2.0</span>
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
        variant="flat"
        class="ml-2 px-6 tooltip-btn tooltip-primary"
        height="40"
        @click="updateSrc"
      >
        <v-icon start size="small">mdi-refresh</v-icon>
        Update
      </v-btn>

      <v-spacer />

      <TooltipButton
        variant="tonal"
        color="secondary"
        icon="mdi-cellphone"
        text="Test on your mobile"
        @click="dialog = true"
      />

      <TooltipButton
        class="mx-4"
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
                  <div class="d-flex align-center w-100">
                    <span
                      class="text-caption font-weight-bold text-primary mr-2"
                    >
                      {{ getSimulatedLabel(item.raw.width) }}
                    </span>
                    <span class="text-caption font-weight-medium mr-2">
                      {{ item.raw.name }}
                    </span>
                    <span
                      class="ml-auto text-mono text-grey-darken-1"
                      style="font-size: 0.7rem"
                    >
                      {{ item.raw.width }}×{{ item.raw.height }}
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
                class="device-transition"
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

    <v-dialog v-model="dialog" max-width="400">
      <v-card color="surface" class="rounded-xl border-themed">
        <v-card-text class="text-center pa-8">
          <div class="text-h5 font-weight-bold mb-2">Mobile Sync</div>
          <p class="text-body-2 text-medium-emphasis mb-6">
            Scan to test <span class="text-primary">{{ url }}</span>
          </p>

          <v-sheet
            elevation="12"
            class="mx-auto mb-6 pa-4 d-inline-block rounded-lg qr-container"
            :color="isDark ? '#FFFFFF' : '#F8FAFC'"
          >
            <qrcode-vue
              :value="url"
              :size="220"
              level="H"
              render-as="svg"
              :foreground="isDark ? '#192841' : '#000000'"
              background="#FFFFFF"
            />
          </v-sheet>

          <v-btn
            block
            size="large"
            color="primary"
            variant="tonal"
            class="rounded-pill"
            @click="dialog = false"
          >
            Got it
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
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

  /* Use Vuetify variables directly - no more JS parsing errors */
  background-color: rgb(var(--v-theme-baseCard));

  /* Map the grid color to the outline theme color */
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

  /* Top Left Bracket */
  &::before {
    top: 10px;
    left: 10px;
    border-right: 0;
    border-bottom: 0;
  }

  /* Bottom Right Bracket */
  &::after {
    bottom: 10px;
    right: 10px;
    border-left: 0;
    border-top: 0;
  }
}

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
    border: 1px solid rgba(var(--v-theme-primary), 0.4) !important;
  }

  :deep(.v-field__input) {
    color: rgb(var(--v-theme-text)) !important;
    opacity: 1 !important;
  }
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

  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.15);

  .label-text {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgb(var(--v-theme-primary));
  }
}

.v-theme--darkTheme .simulated-label-container {
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 2px 6px 0 rgba(0, 0, 0, 0.5);
}

.select-width-refined {
  :deep(.v-field) {
    border-radius: 8px !important;
    background-color: rgb(var(--v-theme-surface));

    /* The Blueprint Primary Outline */
    border: 1px solid rgba(var(--v-theme-primary), 0.4) !important;

    /* transition for hover/focus */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Hover State */
  &:hover :deep(.v-field) {
    border-color: rgba(var(--v-theme-primary), 0.8) !important;
    background-color: color-mix(
      in srgb,
      rgb(var(--v-theme-primary)),
      transparent 96%
    );
  }

  /* Focus State (When dropdown is open) */
  &.v-input--active :deep(.v-field) {
    border-color: rgb(var(--v-theme-primary)) !important;
    box-shadow: 0 0 15px rgba(var(--v-theme-primary), 0.2) !important;
  }

  /* Ensure the text matches the theme */
  :deep(.v-field__input) {
    font-size: 0.85rem;
    font-weight: 500;
  }
}

.mini-label-badge {
  font-size: 9px;
  font-weight: 900;
  padding: 1px 4px;
  border: 1px solid currentColor;
  border-radius: 3px;
  color: rgb(var(--v-theme-primary));
}

.device-transition {
  /* This animates width, height, and the zoom transform simultaneously */
  transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1) !important;

  /* Optimization to keep the animation buttery smooth */
  will-change: width, height, transform;
}
</style>
