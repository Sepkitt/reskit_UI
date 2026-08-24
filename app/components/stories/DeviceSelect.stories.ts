import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { action } from "storybook/actions";
import DeviceSelect from "../screen/DeviceSelect.vue";

const devices = [
  {
    name: "Desktop HD",
    width: 1920,
    height: 1080,
    browser: "chrome",
  },
  {
    name: "iPad Air",
    width: 820,
    height: 1180,
    browser: "safari",
  },
  {
    name: "iPhone 15",
    width: 390,
    height: 844,
    browser: "safari",
  },
];

const longDeviceList = [
  ...devices,
  { name: 'MacBook Pro 16"', width: 1728, height: 1117 },
  { name: "MacBook Air", width: 1440, height: 900 },
  { name: "Surface Pro", width: 1368, height: 912 },
  { name: "Galaxy Tab S9", width: 800, height: 1280 },
  { name: "Pixel Tablet", width: 800, height: 1280 },
  { name: "Galaxy S24", width: 412, height: 915 },
  { name: "Pixel 8", width: 412, height: 915 },
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 13 Mini", width: 375, height: 812 },
];

const meta: Meta<typeof DeviceSelect> = {
  title: "Components/DeviceSelect",
  component: DeviceSelect,
  tags: ["autodocs"],

  args: {
    modelValue: devices[0],
    items: devices,
    "onUpdate:modelValue": action("update:modelValue"),
  },

  argTypes: {
    modelValue: {
      control: "object",
      description: "Currently selected device",
    },
    items: {
      control: "object",
      description: "Available device profiles",
    },
  },

  parameters: {
    docs: {
      description: {
        component: `
DeviceSelect is a Vuetify-based device picker used throughout the device simulation workflow.

Features:
- Device classification (Desktop, Tablet, Mobile)
- Custom item rendering
- Dimension display
- Return-object selection
- update:modelValue event support
        `,
      },
    },
  },

  decorators: [
    () => ({
      template: `
        <div style="max-width:600px;padding:24px">
          <story />
        </div>
      `,
    }),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DeviceCategories: Story = {
  args: {
    modelValue: devices[0],
    items: devices,
  },
};

export const DropdownShowcase: Story = {
  render: (args) => ({
    components: { DeviceSelect },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: args.modelValue,
      };
    },
    methods: {
      updateDevice(device: unknown) {
        this.selected = device;
        action("update:modelValue")(device);
      },
    },
    template: `
      <DeviceSelect
        :model-value="selected"
        :items="args.items"
        @update:modelValue="updateDevice"
      />
    `,
  }),

  args: {
    modelValue: devices[0],
    items: devices,
  },
};

export const LongDeviceList: Story = {
  args: {
    modelValue: longDeviceList[0],
    items: longDeviceList,
  },
};

export const EmptyState: Story = {
  args: {
    modelValue: {},
    items: [],
  },
};

export const MobileSelected: Story = {
  args: {
    modelValue: devices[2],
    items: devices,
  },
};

export const TabletSelected: Story = {
  args: {
    modelValue: devices[1],
    items: devices,
  },
};

export const DesktopSelected: Story = {
  args: {
    modelValue: devices[0],
    items: devices,
  },
};

export const Playground: Story = {
  render: (args) => ({
    components: { DeviceSelect },
    setup() {
      return { args };
    },
    data() {
      return {
        selected: args.modelValue,
      };
    },
    methods: {
      updateDevice(device: unknown) {
        this.selected = device;
        action("update:modelValue")(device);
      },
    },
    template: `
      <DeviceSelect
        :model-value="selected"
        :items="args.items"
        @update:modelValue="updateDevice"
      />
    `,
  }),
};
