import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { action } from "storybook/actions";
import { h } from "vue";

import Device from "../screen/Device.vue";

const meta: Meta<typeof Device> = {
  title: "Components/Device",
  component: Device,
  tags: ["autodocs"],

  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Device provides a responsive device preview experience including:

- Browser chrome simulation
- Responsive viewport rendering
- Zoom support
- Device panning
- Loading states
- Empty state rendering
- Navigation event tracking
- Custom controls via the content slot
        `,
      },
    },
  },

  decorators: [
    () => ({
      template: `
        <div
          style="
            height:300px;
            width:100%;
            position:relative;
          "
        >
          <story />
        </div>
      `,
    }),
  ],

  args: {
    width: 1080,
    height: 720,
    zoom: 0,
    src: "",
    showBrowserUI: true,
    device: {
      browser: "chrome",
    },

    "onUpdate:zoom": action("update:zoom"),
    // navigation: action("navigation"),
  },

  argTypes: {
    width: {
      control: "number",
    },

    height: {
      control: "number",
    },

    src: {
      control: "text",
    },

    zoom: {
      control: {
        type: "range",
        min: 0,
        max: 3,
        step: 0.1,
      },
    },

    showBrowserUI: {
      control: "boolean",
    },

    device: {
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};

