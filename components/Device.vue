<script setup lang="ts">
import { data } from "~/assets/simulationScale.json";
import { Device } from "~/types/interfaces/simulationscale";
const { $vuetify } = useNuxtApp();
// import {
//   ScreenType,
//   SimulatedBreakpoints,
//   VuetifyBreakpoints,
// } from "@/types/enums/deviceBreakpoints";

// console.log({ devices })
// ENUMS
enum ScreenType {
  PHONE = "phone",
  TABLET = "tablet",
  LAPTOP = "laptop",
  TELEVISION = "television",
}
enum SimulatedBreakpoints {
  XXL = "simultated-4k",
  XL = "simultated-xl",
  LG = "simultated-lg",
  MD = "simultated-md",
  SM = "simultated-sm",
  XS = "simultated-xs",
}

enum VuetifyBreakpoints {
  XL = "xl",
  LG = "lg",
  MD = "md",
  SM = "sm",
  XS = "xs",
}

interface Props {
  height?: number;
  width: number;
  screen: ScreenType;
  src: string;
  fullscreen: boolean;
  simulationBreakpoints: SimulatedBreakpoints;
}
const props = withDefaults(defineProps<Props>(), {
  src: "https://nuxtjs.org/",
});

interface SimulatedDeviceDimentions {
  name: SimulatedBreakpoints;
  breakpoint: { min: number; max: number };
}

const simulatedDeviceDimentions: SimulatedDeviceDimentions[] = [
  {
    name: SimulatedBreakpoints.XXL,
    breakpoint: {
      min: 2160,
      max: Infinity,
    },
  },
  {
    name: SimulatedBreakpoints.XL,
    breakpoint: {
      min: 1904,
      max: 2160,
    },
  },
  {
    name: SimulatedBreakpoints.LG,
    breakpoint: {
      min: 1264,
      max: 1904,
    },
  },
  {
    name: SimulatedBreakpoints.MD,
    breakpoint: {
      min: 960,
      max: 1264,
    },
  },
  {
    name: SimulatedBreakpoints.SM,
    breakpoint: {
      min: 600,
      max: 1264,
    },
  },
  {
    name: SimulatedBreakpoints.XS,
    breakpoint: {
      min: 0,
      max: 600,
    },
  },
];

const simulationBreakpoints = computed(() => {
  //this is needed nested underneath vuetify's initial breakpoint switch function
  // use-case
  // if you have large screen (>1264px < 1904px) and you want to simulate xl screens (>1904)
  // this function allow you to add breakponts onto the simulated screens
  // if you dont use this, you wont be able to simulate 4k screens and their smaller versions acurrately
  // let simulation: string;
  // // TODO: Refactor the below, to make it work like the switch function
  // simulatedDeviceDimentions.forEach(({ name, breakpoint }) => {
  //   if (props.width < breakpoint.max && props.width > breakpoint.min) {
  //     simulation = name;
  //   }
  // });
  // console.log("simulation", simulation);
  // return simulation;
  switch (true) {
    //4k
    case props.width > 2160:
      // console.log('simultated-4k');
      return SimulatedBreakpoints.XXL;
    // xl
    case props.width < 2160 && props.width > 1904:
      // console.log('simultated-xl');
      return SimulatedBreakpoints.XL;
    // lg
    case props.width < 1904 && props.width > 1264:
      // console.log('simultated-lg');
      return SimulatedBreakpoints.LG;
    // md
    case props.width < 1264 && props.width > 960:
      // console.log('simultated-md');
      return SimulatedBreakpoints.MD;
    // sm
    case props.width < 960 && props.width > 600:
      return SimulatedBreakpoints.SM;
    // xs
    case props.width < 600:
      return SimulatedBreakpoints.XS;
  }
});

/* Create an array based on the
  interface RootArray extends Array<Device>{}
  Get array from JSON based on interface
  let simulatedDeviceSettings: Device[] = data */

interface RootArray extends Array<Device> {}
// // Get array from JSON based on interface
let simulatedDeviceSettings: RootArray = data;

// gets enum values and returns an array
const enum_as_array = (object: object) => {
  const enum_values_to_array = Object.values(object).filter((v) => isNaN(Number(v)));
  return enum_values_to_array;
};

const wrapperScaleStyles = computed(() => {
  let wrapper_scale: string;
  simulatedDeviceSettings.map(({ type, breakpoints }) => {
    if (props.screen === type) {
      breakpoints.map(({ name, simulations }) => {
        if ($vuetify.breakpoint.name === name) {
          simulations.map(({ screen, scale }) => {
            if (simulationBreakpoints.value === screen) {
              if (props.fullscreen === true) {
                wrapper_scale = "scale(0.8, 0.8)";
              } else {
                wrapper_scale = scale;
              }
            }
          });
        }
      });
    }
  });

  return wrapper_scale;
});
</script>
<template>
  <div id="wrapper" :style="`transform: ${wrapperScaleStyles};`">
    <v-sheet elevation="10" class="device" color="red" :height="height" :width="width">
      <iframe
        id="frame_1"
        style="pointer-events: none"
        class="holds-the-iframe"
        :src="src"
      />
    </v-sheet>
  </div>
</template>

<style lang="scss" scoped>
#wrapper {
  transform-origin: top center;
  display: grid;
  align-items: center;
  justify-content: center;
}

.device {
  margin: 0 auto;
  overflow: hidden;
  transition: all 0.5s ease;
  -webkit-animation: fadein 2s;
  /* Safari, Chrome and Opera > 12.1 */
  -moz-animation: fadein 2s;
  /* Firefox < 16 */
  -ms-animation: fadein 2s;
  /* Internet Explorer */
  -o-animation: fadein 2s;
  /* Opera < 12.1 */
  animation: fadein 2s;
}

.device iframe {
  border: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.holds-the-iframe {
  background: url("../static/loading.gif") center center no-repeat;
  background-color: #21426a;
}
</style>
