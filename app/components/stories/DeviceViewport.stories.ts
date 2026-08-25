import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { action } from "storybook/actions";
import DeviceViewport from "../screen/DeviceViewport.vue";

const devices = [
  {
    name: "iPhone 15",
    width: 390,
    height: 844,
    browser: "safari",
  },
  {
    name: "iPad Air",
    width: 820,
    height: 1180,
    browser: "safari",
  },
  {
    name: "Desktop HD",
    width: 1920,
    height: 1080,
    browser: "chrome",
  },
];


const meta: Meta<typeof DeviceViewport> = {
  title: "Components/DeviceViewport",
  component: DeviceViewport,
  tags: ["autodocs"],

  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Primary device simulation workspace.

Features:
- Device Selection
- Device Rotation
- Zoom Controls
- Performance Diagnostics
- Network Throttling
- Responsive Preview
- Device Navigation Events
        `,
      },
    },
  },

  args: {
    device: devices[2],
    items: devices,
    zoom: 0,
    rotate: false,
    frameNo: 1,
    src: "https://example.com",
    maxHeight: "100%",

    "onUpdate:device": action("update:device"),
    "onUpdate:zoom": action("update:zoom"),
    "onUpdate:rotate": action("update:rotate"),
    // "@navigation": action("navigate"),
  },

  argTypes: {
    device: {
      control: "object",
    },
    items: {
      control: "object",
    },
    zoom: {
      control: {
        type: "range",
        min: 0,
        max: 3,
        step: 0.1,
      },
    },
    rotate: {
      control: "boolean",
    },
    src: {
      control: "text",
    },
    frameNo: {
      control: {
        type: "radio",
      },
      options: [1, 2],
    },
    maxHeight: {
      control: "text",
    },
  },

  decorators: [
    () => ({
      template: `
        <div
          style="
            width:100%;
            height:900px;
            padding:16px;
          "
        >
          <story />
        </div>
      `,
    }),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MobileViewport: Story = {
  args: {
    device: devices[0],
  },
};

export const TabletViewport: Story = {
  args: {
    device: devices[1],
  },
};
export const DesktopViewport: Story = {
  args: {
    device: devices[2],
  },
};

export const DeviceSelection: Story = {
  render: (args) => ({
    components: { DeviceViewport },

    data() {
      return {
        currentDevice: args.device,
      };
    },

    methods: {
      updateDevice(device: unknown) {
        this.currentDevice = device;
        action("update:device")(device);
      },
    },

    template: `
      <DeviceViewport
        v-bind="args"
        :device="currentDevice"
        @update:device="updateDevice"
      />
    `,

    setup() {
      return { args };
    },
  }),
};

export const PerformanceDiagnostics: Story = {
  args: {
    device: devices[2],
    zoom: 1,
  },

  parameters: {
    docs: {
      description: {
        story:
          "Open the FPS indicator to view performance statistics and system health.",
      },
    },
  },
};

export const NetworkOnline: Story = {
  args: {
    device: devices[2],
  },
};
export const NetworkOffline: Story = {
  args: {
    src: "about:blank",
  },

  parameters: {
    docs: {
      description: {
        story:
          "Use Network menu to switch to OFFLINE and verify EmptyState rendering.",
      },
    },
  },
};

export const FrameOneLayout: Story = {
  args: {
    frameNo: 1,
  },
};

export const FrameTwoLayout: Story = {
  args: {
    frameNo: 2,
  },
};

