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

// 1. Reactive State
const { name: currentBreakpoint } = useDisplay();
const url = ref("https://nuxtjs.org/");
const src = ref("https://nuxtjs.org/");
const dialog = ref(false);
const showShells = ref(true);

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

const maxHeight = computed(
  () => cardSizeMap[currentBreakpoint.value] || "100%",
);

// 3. Helper: Identify current simulated size label
const getSimulatedLabel = (width) => {
  const w = Number(width);
  if (w >= 3840) return "4k";
  if (w >= 2560) return "2k/qhd";
  if (w >= 1904) return "xl";
  if (w >= 1264) return "lg";
  if (w >= 960)  return "md";
  if (w >= 600)  return "sm";
  return "xs";
};

const updateSrc = () => {
  // Simple validation to prepend https if missing
  let target = url.value.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = 'https://' + target;
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
            color="infoBg"
            elevation="4"
          >
           <v-toolbar color="info" density="compact">
                <div class="sheet tooltip-primary d-flex align-center px-4 ml-2">
                  <span class="text-caption font-weight-bold text-uppercase">
                    {{ getSimulatedLabel(device.breakpoint.width) }}
                  </span>
                </div>

                <v-spacer />
               <div style="width: 140px" class="mx-4 mt-5">
               <v-slider
  v-model="device.zoom"
  min="0"
  max="1.5"
  step="0.05"
  density="compact"
  color="white"
  hide-details
>
  <template #prepend>
    <v-icon 
      size="small" 
      @click="device.zoom = 0" 
      class="cursor-pointer"
    >
      {{ device.zoom === 0 ? 'mdi-fit-to-screen' : 'mdi-magnify-minus' }}
    </v-icon>
  </template>
</v-slider>
              </div>



                <v-select
                  v-model="device.breakpoint"
                  :items="device.items"
                  item-title="name"
                  return-object
                  density="compact"
                  variant="solo"
                  bg-color="darkness"
                  hide-details
                  class="select-width mx-2"
                >
                  <template #selection="{ item }">
                    {{ item.raw.name }} ({{ item.raw.width }}x{{ item.raw.height }})
                  </template>
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="`${item.raw.width} x ${item.raw.height}`" />
                  </template>
                </v-select>

                <v-btn
                  :icon="device.rotate ? 'mdi-phone-rotate-landscape' : 'mdi-phone-rotate-portrait'"
                  variant="text"
                  @click="device.rotate = !device.rotate"
                />
              </v-toolbar>

            <div class="device-viewport-container" :class="device.id === 1 ? 'grid-primary' : 'grid-tertiary'">
              <Device
                v-model:zoom="device.zoom" 
                :height="device.rotate ? device.breakpoint.width : device.breakpoint.height"
                :width="device.rotate ? device.breakpoint.height : device.breakpoint.width"
                :device="device.breakpoint"
                :src="src"
                :show-browser-ui="showShells"
              />
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
// .device-viewport-container {
// flex-grow: 1;
//   position: relative;
//   overflow: hidden; /* Clips the absolutely positioned device */
//   background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 100%);
// }

// .device-viewport-container {
//   flex-grow: 1;
//   position: relative;
//   overflow: hidden;
  
//   /* Grid Blueprint Background */
//   background-color: rgba(var(--v-theme-infoBg), 0.8);
//   background-image: 
//     linear-gradient(rgba(255,255,255, .05) 1px, transparent 1px),
//     linear-gradient(90deg, rgba(255,255,255, .05) 1px, transparent 1px);
//   background-size: 20px 20px;
// }
// .max-width-600 {
//   max-width: 600px;
// }



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
  
  // 1. Establish the color variable (Defaults to Info if no class is provided)
  --t-color: rgb(var(--v-theme-info)); 

  // 2. Background: Mix 15% of your theme color into the surface
  background-color: color-mix(in srgb, var(--t-color), rgb(var(--v-theme-surface)) 85%);
  
  // 3. Grid Lines: Use the theme color at a very low opacity (5%)
  background-image: 
    linear-gradient(color-mix(in srgb, var(--t-color), transparent 95%) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--t-color), transparent 95%) 1px, transparent 1px);
  background-size: 20px 20px;

  // Optional: Add a subtle vignette to give it depth
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%);
  }
}

// 4. Re-use your existing mapping to switch the grid theme dynamically
.grid-primary { --t-color: rgb(var(--v-theme-primary)); }
.grid-accent  { --t-color: rgb(var(--v-theme-accent)); }
.grid-success { --t-color: rgb(var(--v-theme-success)); }
.grid-info    { --t-color: rgb(var(--v-theme-info)); }
.grid-tertiary{ --t-color: rgb(var(--v-theme-tertiary)); }

.cursor-pointer {
  cursor: pointer;
}

/* Custom Scrollbar for the list */
:deep(.v-list) {
  max-height: 400px;
}
</style>
