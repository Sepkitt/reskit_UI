<script setup lang="ts">
import { data } from "~/assets/simulationScale.json";
import { Device } from "~~/types/interfaces";
const { $vuetify } = useNuxtApp();
// import { ScreenType, SimulatedBreakpoints, VuetifyBreakpoints } from '@/types/enums'

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

// INTERFACES

// interface RootObject {
//   devices: Device[];
// }

// interface Device {
//   type: ScreenType;
//   breakpoints: Breakpoint[];
// }

// interface Breakpoint {
//   name: VuetifyBreakpoints;
//   simulations: Simulation[];
// }

// interface Simulation {
//   screen: SimulatedBreakpoints;
//   scale(): string;
// }

// Props

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

// Create an array based on the
// interface RootArray extends Array<Device>{}
// Get array from JSON based on interface
// let simulatedDeviceSettings: Device[] = data

// alternative
interface RootArray extends Array<Device> {}
// // Get array from JSON based on interface
let simulatedDeviceSettings: RootArray = data;

// gets enum values and returns an array
const enum_as_array = (object: object) => {
  const enum_values_to_array = Object.values(object).filter((v) => isNaN(Number(v)));
  return enum_values_to_array;
};

const wrapperScaleStyles = computed(() => {
  // const {breakpoints} = simulatedDeviceSettings
  // console.log({breakpoints})
  // const {type: breakpoints = simulatedDeviceSettings.breakpoints.map(b => ({name: b.name})) } = simulatedDeviceSettings
  // const screenTypes = getCase(ScreenType); // tablet, phone, etc
  // const simulated = getCase(Simulated); // simulated-xs, simulated-xl, etc

  // const get_breakpoints = enum_as_array(VuetifyBreakpoints)

  let wrapper_scale: string;
  simulatedDeviceSettings.map(({ type, breakpoints }) => {
    /*
     Dummy code

      if (props.screen === type)
        switch($vuetify.breakpoint.name)
        case: breakpoint.name
          switch(simulationBreakpoints)
          case: simulations.name
            return simulation.scale
    */

    if (props.screen === type) {
      breakpoints.map(({ name, simulations }) => {
        if ($vuetify.breakpoint.name === name) {
          simulations.map(({ screen, scale }) => {
            if (simulationBreakpoints.value === screen) {
              if (props.fullscreen === true) {
                wrapper_scale = "scale(0.8, 0.8)";
              } else {
                // console.log({ type: type });
                // console.log({ screen: screen }, { scale: scale });
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

// export default {
//   props: {
//     activeDevice: { type: Object },
//     height: {
//       required: false,
//     },
//     width: {
//       required: false,
//     },
//     screen: { type: String },
//     src: {
//       type: String,
//       default: 'https://nuxtjs.org/',
//     },
//     deviceType: {
//       type: String,
//     },
//     types: {
//       type: Array,
//     },
//     fullscreen: {
//       type: [Boolean, String]
//     }
//   },
//   computed: {
//     // Check what screen size
//     simulationBreakpoints() {
//       //this is needed nested underneath vuetify's initial breakpoint switch function
//       // use-case
//       // if you have large screen (>1264px < 1904px) and you want to simulate xl screens (>1904)
//       // this function allow you to add breakponts onto the simulated screens
//       // if you dont use this, you wont be able to simulate 4k screens and their smaller versions acurrately
//       //create a base for the switch function
//       switch (true) {
//         //4k
//         case this.width > 2160:
//           console.log('simultated-4k');

//           return 'simultated-4k';

//         // xl
//         case this.width < 2160 && this.width > 1904:
//           console.log('simultated-xl');

//           return 'simultated-xl';
//         // lg
//         case this.width < 1904 && this.width > 1264:
//           console.log('simultated-lg');
//           return 'simultated-lg';
//         // md
//         case this.width < 1264 && this.width > 960:
//           console.log('simultated-md');
//           return 'simultated-md';
//         // sm
//         case this.width < 960 && this.width > 600:
//           return 'simultated-sm';
//         // xs
//         case this.width < 600:
//           return 'simultated-xs';
//       }
//     },
//     wrapperScaleStyles() {
//       // check what screen it is eg: (laptop, tablet, etc)
//       // check what viewpoint it is eg: (xl, lg etc)
//       // Create a component property that will store simulated breakpoints that matches vuetify
//       // Each value should return the group they belong to eg md, xl etc
//       // Call the simulated breakpoints in a switch function and within each case return the correct scaling
//       switch (true) {
//         case this.screen === 'television':
//           switch (this.$vuetify.breakpoint.name) {
//             case 'xl':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-4k':
//                   return 'scale(0.28, 0.28)';
//                 case 'simultated-xl':
//                   return 'scale(0.56, 0.56)';
//                 case 'simultated-lg':
//                   return 'scale(0.6, 0.6)';
//                 case 'simultated-md':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return 'scale(0.4, 0.4)';
//               }

//             case 'lg':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-4k':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.25, 0.25)';
//                 case 'simultated-xl':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.5, 0.5)';
//                 case 'simultated-lg':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.7, 0.7)';
//                 case 'simultated-md':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//               }

//             case 'md':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-4k':
//                   return 'scale(0.2, 0.2)';
//                 case 'simultated-xl':
//                   return 'scale(0.5, 0.5)';
//                 case 'simultated-lg':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-md':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//               }

//             case 'sm':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-4k':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.3, 0.3)';
//                 case 'simultated-xl':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.3, 0.3)';
//                 case 'simultated-lg':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-md':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//               }

//             case 'xs':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-4k':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.3, 0.3)';
//                 case 'simultated-xl':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.1, 0.1)';
//                 case 'simultated-lg':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-md':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//               }
//           }
//         case this.screen === 'laptop':
//           switch (this.$vuetify.breakpoint.name) {
//             case 'xl':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-xl':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.1, 0.1)';
//                 case 'simultated-lg':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.75, 0.75)';
//                 case 'simultated-md':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//               }

//             case 'lg':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-xl':
//                   return 'scale(0.1, 0.1)';
//                 case 'simultated-lg':
//                   return 'scale(0.6, 0.6)';
//                 case 'simultated-md':
//                   return 'scale(0.6, 0.6)';
//                 case 'simultated-sm':
//                   return 'scale(0.5, 0.5)';
//                 case 'simultated-xs':
//                   return 'scale(0.5, 0.5)';
//               }

//             case 'md':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-xl':
//                   return 'scale(0.1, 0.1)';
//                 case 'simultated-lg':
//                   return 'scale(0.5, 0.5)';
//                 case 'simultated-md':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//               }

//             case 'sm':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-xl':
//                   return 'scale(0.1, 0.1)';
//                 case 'simultated-lg':
//                   return 'scale(0.2, 0.2)';
//                 case 'simultated-md':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//               }

//             case 'xs':
//               //Simulated breakpoints
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-xl':
//                   return 'scale(0.1, 0.1)';
//                 case 'simultated-lg':
//                   return 'scale(0.2, 0.2)';
//                 case 'simultated-md':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return this.fullscreen === true ? 'scale(0.8, 0.8)' : 'scale(0.4, 0.4)';
//               }
//           }
//         case this.screen === 'tablet':
//           switch (this.$vuetify.breakpoint.name) {
//             case 'xl':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-xl':
//                   return 'scale(0.1, 0.1)';
//                 case 'simultated-lg':
//                   return 'scale(0.6, 0.6)';
//                 case 'simultated-md':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return 'scale(0.3, 0.3)';
//                 case 'simultated-xs':
//                   return 'scale(0.4, 0.4)';
//               }

//             case 'lg':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-xl':
//                   return 'scale(0.1, 0.1)';
//                 case 'simultated-lg':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-md':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return 'scale(0.4, 0.4)';
//               }

//             case 'md':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-xl':
//                   return 'scale(0.1, 0.1)';
//                 case 'simultated-lg':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-md':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return 'scale(0.4, 0.4)';
//               }

//             case 'sm':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-xl':
//                   return 'scale(0.1, 0.1)';
//                 case 'simultated-lg':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-md':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return 'scale(0.4, 0.4)';
//               }

//             case 'xs':
//               //Simulated breakpoints
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-xl':
//                   return 'scale(0.1, 0.1)';
//                 case 'simultated-lg':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-md':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-sm':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return 'scale(0.4, 0.4)';
//               }
//           }
//         case this.screen === 'phone':
//           switch (this.$vuetify.breakpoint.name) {
//             case 'xl':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-md':
//                   return 'scale(0.5, 0.5)';
//                 case 'simultated-sm':
//                   return 'scale(0.6, 0.6)';
//                 case 'simultated-xs':
//                   return 'scale(0.8, 0.8)';
//               }

//             case 'lg':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-md':
//                   return 'scale(0.32, 0.32)';
//                 case 'simultated-sm':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return 'scale(0.6, 0.6)';
//               }

//             case 'md':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-md':
//                   return 'scale(0.5, 0.5)';
//                 case 'simultated-sm':
//                   return 'scale(0.7, 0.7)';
//                 case 'simultated-xs':
//                   return 'scale(0.6, 0.6)';
//               }

//             case 'sm':
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-md':
//                   return 'scale(0.5, 0.5)';
//                 case 'simultated-sm':
//                   return 'scale(0.4, 0.4)';
//                 case 'simultated-xs':
//                   return 'scale(0.4, 0.4)';
//               }

//             case 'xs':
//               //Simulated breakpoints
//               switch (this.simulationBreakpoints) {
//                 case 'simultated-sm':
//                   return 'scale(0.8, 0.8)';
//                 case 'simultated-xs':
//                   return 'scale(0.8, 0.8)';
//               }
//           }
//       }
//     },
//   },
// };
</script>
<template>
  <div id="wrapper" :style="`transform: ${wrapperScaleStyles};`">
    <v-sheet elevation="10" class="device" color="red" :height="height" :width="width">
      <iframe id="frame_1" class="holds-the-iframe" :src="src" />
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
