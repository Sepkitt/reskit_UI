<script setup lang="ts">
import { phones, tablets, laptops, televisions, TYPES } from "~/assets/devices.json";
import { VuetifyBreakpoints } from "~/types/enums/deviceBreakpoints";
import { Breakpoint } from "../../types/interfaces/simulationscale";
import { Device } from "../../.nuxt/components";
// import { SimulatedBreakpoints } from "../../types/enums/deviceBreakpoints";
const lgAndUp = [...laptops, ...televisions];
const mdAndDown = [...phones, ...tablets];
const { $vuetify } = useNuxtApp();

interface Device {
  id: number;
  rotate: boolean;
  lg: number;
  xl: number;
  screenSize: VuetifyBreakpoints;
  items: object[];
  breakpoint: object;
  fullscreen: boolean;
}

const devices = ref([
  {
    id: 1,
    rotate: false,
    lg: 8,
    xl: 7,
    screenSize: VuetifyBreakpoints.LGANDUP,
    items: lgAndUp,
    breakpoint: lgAndUp[3],
    fullscreen: false,
  },
  {
    id: 2,
    rotate: false,
    xl: 5,
    lg: 4,
    screenSize: VuetifyBreakpoints.MDANDDOWN,
    items: mdAndDown,
    breakpoint: mdAndDown[6],
    fullscreen: false,
  },
]);
// const devices: Device[] = [
const dialog = ref(false);
const url = ref("https://nuxtjs.org/");
const src = ref("https://nuxtjs.org/");

interface CardSizes {
  breakpoint: VuetifyBreakpoints;
  size: string;
}

const cardSizes: CardSizes[] = [
  {
    breakpoint: VuetifyBreakpoints.XS,
    size: "100%",
  },
  {
    breakpoint: VuetifyBreakpoints.SM,
    size: "100%",
  },
  {
    breakpoint: VuetifyBreakpoints.MD,
    size: "600px",
  },
  {
    breakpoint: VuetifyBreakpoints.LG,
    size: "700px",
  },
  {
    breakpoint: VuetifyBreakpoints.XL,
    size: "850px",
  },
];

const maxHeight = computed(() => {
  //refractored switch function to make use of array
  for (const item of cardSizes) {
    switch ($vuetify.breakpoint.name) {
      case item.breakpoint:
        console.log({
          item,
        });
        return item.size;
    }
  }
});

const toggle = (device) => {
  return (device.fullscreen = false);
};

const simulationBreakpoints = (device) => {
  console.log({ "Device Here": device });

  // console.log({ devices: devices });
  // for (const item of devices) {
  //   if (item.id === device.id) {
  switch (true) {
    //4k
    case device.breakpoint.width > 2160:
      return "4k";
    // xl
    case device.breakpoint.width < 2160 && device.breakpoint.width > 1904:
      return "xl";
    // lg
    case device.breakpoint.width < 1904 && device.breakpoint.width >= 1264:
      return "lg";
    // md
    case device.breakpoint.width < 1264 && device.breakpoint.width >= 960:
      return "md";
    // sm
    case device.breakpoint.width < 960 && device.breakpoint.width >= 600:
      return "sm";
    // xs
    case device.breakpoint.width < 600:
      return "xs";
  }
  // }
  // }
};
</script>

<template>
  <div>
    <v-app-bar app color="info">
      <v-toolbar-title class="white--text"><img src="" /></v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        class="pt-8 shadow"
        v-model="url"
        solo
        dark
        background-color="darkness"
      >
        <template #append>
          <div class="d-flex align-center justify-center button-click" @click="src = url">
            <CoreArrow variant="path" strokeWidth="6" flip="y" rotate="90"></CoreArrow>
          </div>
        </template>
      </v-text-field>
      <v-spacer></v-spacer>
      <IconClick title="View on mobile" icon="mdi-qrcode" @click="dialog = true" />
    </v-app-bar>
    <v-card color="background">
      <v-row dense>
        <v-col
          class="px-2"
          cols="12"
          ref="deviceRef"
          :xl="device.xl"
          :lg="device.lg"
          v-for="(device, index) in devices"
          :key="index"
        >
          <v-card :height="maxHeight" class="child mt-3" color="infoBg">
            <v-toolbar color="info">
              <div color="secondary" class="d-flex align-center pa-5 sheet text--text">
                {{ simulationBreakpoints(device) }}
              </div>
              <v-spacer></v-spacer>
              <v-select
                dark
                background-color="darkness"
                class="mt-8 mx-5 shadow"
                label="devices"
                v-model="device.breakpoint"
                :items="device.items"
                solo
                cul
              >
                <template #append>
                  <div
                    class="d-flex align-center justify-center button-click"
                    @click.stop="src = url"
                  >
                    <CoreChevron variant="path" strokeWidth="6" flip="x" />
                  </div>
                </template>
                <template slot="selection" slot-scope="data">
                  <!-- HTML that describe how select should render selected items -->

                  {{ data.item.name }} - {{ data.item.width }} x
                  {{ data.item.height }}
                </template>
                <template slot="item" slot-scope="data">
                  <!-- HTML that describe how select should render items when the select is open -->

                  {{ data.item.name }} - {{ data.item.width }} x
                  {{ data.item.height }}
                </template>
              </v-select>
              <v-spacer />
              <IconClick
                v-if="device.screenSize === 'mdAndDown'"
                title="rotate"
                icon="mdi-phone-rotate-landscape"
                @click="device.rotate = !device.rotate"
              />

              <IconClick
                title="fullscreen"
                icon="mdi-circle-expand"
                @click.prevent="device.fullscreen = !device.fullscreen"
              />
            </v-toolbar>

            <fullscreen
              v-if="device.fullscreen === true"
              fullscreenClass="overlay"
              v-model="device.fullscreen"
              class="fullscreen"
            >
              <!--TODO:: Move exit full screeen button to a more apropriate location -->
              <v-fab-transition>
                <v-btn
                  absolute
                  dark
                  right
                  fab
                  @click="device.fullscreen = !device.fullscreen"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-fab-transition>

              <Device
                :fullscreen="device.fullscreen"
                :simulationBreakpoints="simulationBreakpoints"
                :rotate="device.rotate"
                class="mt-5"
                :height="device.breakpoint.height"
                :width="device.breakpoint.width"
                :screen="device.breakpoint.screen"
                :src="src"
              />
            </fullscreen>
            <Device
              :fullscreen="device.fullscreen"
              :simulationBreakpoints="simulationBreakpoints"
              :rotate="device.rotate"
              class="mt-5"
              :height="device.breakpoint.height"
              :width="device.breakpoint.width"
              :screen="device.breakpoint.screen"
              :src="src"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <Dialog v-model="dialog" maxWidth="250" closeBTNName="Not Now">
      <cardsQrCard :url="url" slot="content" />
    </Dialog>
  </div>
</template>
