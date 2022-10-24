// import { SimulatedBreakpoints, ScreenType, VuetifyBreakpoints } from "./enums";
export interface RootObject {
  devices: Device[];
}

export interface Device {
  type: string;
  breakpoints: Breakpoint[];
}

export interface Breakpoint {
  name: string;
  simulations: Simulation[];
}

export interface Simulation {
  screen: string;
  scale: string;
}

