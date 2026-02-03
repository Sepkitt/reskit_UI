<script setup>
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";

import {
  phones,
  tablets,
  laptops,
  televisions,
  TYPES,
} from "~/assets/devices.json";

const { isDark, toggleTheme,themeColor } = useMyTheme();


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
    <v-app-bar color="info" elevation="2">
      <v-toolbar-title class="text-white font-weight-bold"
        >resKit</v-toolbar-title
      >
      <v-spacer />

      <v-text-field
        v-model="url"
        density="compact"
        variant="solo"
        bg-color="background"
        hide-details
        @keyup.enter="updateSrc"
      />

      <v-btn color="primary" variant="elevated" class="ml-3" @click="updateSrc">
        update
      </v-btn>

      <v-spacer />

      <v-btn icon @click="dialog = true">
        <v-icon>mdi-qrcode</v-icon>
      </v-btn>
<TooltipButton 
              color="success"
              :icon="
                isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'
              "
              :text="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              @click="toggleTheme"
            />
    </v-app-bar>

    <v-container fluid class="fill-height bg-background pa-0">
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
            max-width="100vw"
            class="d-flex flex-column"
            color="background"
            elevation="4"
          >
            <v-toolbar color="info" density="compact">
              <div class="sheet tooltip-primary d-flex align-center px-4 ml-2">
              <ClientOnly>
                <span class="text-caption font-weight-bold text-uppercase">
                  {{ getSimulatedLabel(device.breakpoint.width) }}
                </span>
                <template #fallback>
                  <span class="text-caption font-weight-bold text-uppercase">...</span>
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
                variant="solo"
                bg-color="background"
                hide-details
                class="select-width mx-2"
              >
                <template #selection="{ item }">
                  {{ item.raw.name }} ({{ item.raw.width }}x{{
                    item.raw.height 
                  }})
                </template>
                <template #item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :subtitle="`${item.raw.width} x ${item.raw.height}`"
                  />
                </template>
              </v-select>

              <v-btn
                :icon="
                  device.rotate
                    ? 'mdi-phone-rotate-landscape'
                    : 'mdi-phone-rotate-portrait'
                "
                variant="text"
                @click="device.rotate = !device.rotate"
              />
            </v-toolbar>

            <div
              class="device-viewport-container"
              :class="'grid-tertiary'"
            >
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
                  color="accent"
                  direction="vertical"
                  show-ticks="always"
                  hide-details
                >
                  <template #prepend>
                    <v-icon
                      color="accent"
                      @click="device.zoom = 0"
                      class="cursor-pointer"
                    >
                      {{
                        device.zoom === 0
                          ? "mdi-fit-to-screen"
                          : "mdi-magnify-minus"
                      }}
                    </v-icon>
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
      <v-card color="surface">
        <v-card-text class="text-center pa-6">
          <div class="text-h6 mb-4">Test on Mobile</div>
          <div class="qr-placeholder mx-auto mb-4">
            <p class="text-caption">QR Code for:<br />{{ url }}</p>
          </div>
          <v-btn block color="primary" @click="dialog = false">Close</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.sheet {
  height: 2.2rem;
  // border-radius: 5px;
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


</style>
