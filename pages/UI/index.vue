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
    <v-card color="background" :height="$vuetify.breakpoint.lgAndUp ? '100vh' : '100%'">
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
                    @click="src = url"
                  >
                    <CoreChevron variant="path" strokeWidth="6" flip="x" />
                  </div>
                </template>
                <template slot="selection" slot-scope="data">
                  <!-- HTML that describe how select should render selected items -->

                  {{ data.item.name }} - {{ data.item.width }} x {{ data.item.height }}
                </template>
                <template slot="item" slot-scope="data">
                  <!-- HTML that describe how select should render items when the select is open -->

                  {{ data.item.name }} - {{ data.item.width }} x {{ data.item.height }}
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

            <fullscreen fullscreenClass="overlay" v-model="device.fullscreen">
              <!--TODO:: Move exit full screeen button to a more apropriate location -->
              <div ref="node" id="rotate">
                <v-fab-transition>
                  <v-btn
                    absolute
                    dark
                    right
                    fab
                    @click="device.fullscreen = !device.fullscreen"
                    v-if="device.fullscreen"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-fab-transition>

                <Device
                  :fullscreen="device.fullscreen"
                  :simulationBreakpoints="simulationBreakpoints"
                  :rotate="device.rotate"
                  class="mt-5"
                  :height="
                    device.rotate === false
                      ? device.breakpoint.height
                      : device.breakpoint.width
                  "
                  :width="
                    device.rotate === false
                      ? device.breakpoint.width
                      : device.breakpoint.height
                  "
                  :screen="device.breakpoint.screen"
                  :src="src"
                />
              </div>
            </fullscreen>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <Dialog v-model="dialog" maxWidth="250" closeBTNName="Not Now">
      <cardsQrCard :url="url" slot="content" />
    </Dialog>
  </div>
</template>

<script>
import { phones, tablets, laptops, televisions, TYPES } from "~/assets/devices.json";
import Structure from "~/components/Structure.vue";
import Device from "~/components/Device.vue";

export default {
  components: {
    Structure,
    Device,
  },
  asyncData(context) {
    // console.log(context)
    const lgAndUp = [...laptops, ...televisions];
    const mdAndDown = [...phones, ...tablets];
    //initial selection for Vmodel
    const devices = [
      {
        id: 1,
        rotate: false,
        lg: 8,
        xl: 7,

        screenSize: "lgAndUp",
        items: lgAndUp,
        breakpoint: lgAndUp[3],
        viewport: "",
        fullscreen: false,
      },
      {
        id: 2,
        rotate: false,
        xl: 5,
        lg: 4,
        screenSize: "mdAndDown",
        items: mdAndDown,
        breakpoint: mdAndDown[6],
        viewport: "",
        fullscreen: false,
      },
    ];

    return {
      devices,
    };
  },

  setup() {
    const dialog = ref(false);

    return { dialog };
  },
  data() {
    return {
      // dialog: false,
      url: "https://nuxtjs.org/",
      src: "https://nuxtjs.org/",
      // Device types
      types: TYPES,

      // Devices
      phones: phones,
      tablets: tablets,
      laptops: laptops,
      televisions: televisions,

      cardSizes: [
        {
          breakpoint: "xs",
          size: "100%",
        },
        {
          breakpoint: "sm",
          size: "100%",
        },
        {
          breakpoint: "md",
          size: "600px",
        },
        {
          breakpoint: "lg",
          size: "700px",
        },
        {
          breakpoint: "xl",
          size: "850px",
        },
      ],
    };
  },

  computed: {
    maxHeight() {
      //refractored switch function to make use of array
      for (const item of this.cardSizes) {
        switch (this.$vuetify.breakpoint.name) {
          case item.breakpoint:
            console.log({
              item,
            });
            return item.size;
        }
      }
    },
  },
  mounted() {},
  methods: {
    toggle(device) {
      device.fullscreen = false;
    },

    simulationBreakpoints(device) {
      for (const item of this.devices) {
        if (item.id === device.id) {
          switch (true) {
            //4k
            case device.breakpoint.width > 2160:
              return "4k";
            // xl
            case device.breakpoint.width < 2160 && device.breakpoint.width > 1904:
              return "xl";
            // lg
            case device.breakpoint.width < 1904 && device.breakpoint.width > 1264:
              return "lg";
            // md
            case device.breakpoint.width < 1264 && device.breakpoint.width > 960:
              return "md";
            // sm
            case device.breakpoint.width < 960 && device.breakpoint.width > 600:
              return "sm";
            // xs
            case device.breakpoint.width < 600:
              return "xs";
          }
        }
      }
    },
  },
  // watch: {
  //   simulationBreakpoints() {
  //     this.simulationBreakpoints
  //   }
  // }
};
</script>

<style></style>
