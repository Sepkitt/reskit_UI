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
const { name: currentBreakpoint, lgAndUp } = useDisplay();
const url = ref("https://nuxtjs.org/");
const src = ref("https://nuxtjs.org/");
const dialog = ref(false);

const lgAndUpDevices = [...laptops, ...televisions];
const mdAndDownDevices = [...phones, ...tablets];

const devices = ref([
  {
    id: 1,
    rotate: false,
    xl: 7,
    lg: 8,
    items: lgAndUpDevices,
    breakpoint: lgAndUpDevices[3],
  },
  {
    id: 2,
    rotate: false,
    xl: 5,
    lg: 4,
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
  if (width >= 2160) return "4k";
  if (width >= 1904) return "xl";
  if (width >= 1264) return "lg";
  if (width >= 960) return "md";
  if (width >= 600) return "sm";
  return "xs";
};

const updateSrc = () => {
  src.value = url.value;
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
        bg-color="darkness"
        hide-details
        class="max-width-600"
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
            <v-toolbar color="info" density="compact"> </v-toolbar>

            <div class="device-viewport-container">
              <Device
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
                :screen="device.breakpoint.screen"
                :src="src"
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
.device-viewport-container {
  flex-grow: 1;      /* Fill the remaining space in the v-card */
  position: relative; /* Needed for the absolute positioning inside Device.vue */
  width: 100%;
}
.max-width-600 {
  max-width: 600px;
}

.select-width {
  max-width: 250px;
}

.sheet {
  border: 1px solid rgb(var(--v-theme-primary));
  height: 32px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  color: white;
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
</style>
