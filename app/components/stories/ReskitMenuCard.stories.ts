import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { action } from "storybook/actions";

import ReskitMenuCard from "../ReskitMenuCard.vue";

const diagnosticItems = [
  {
    label: "RENDERING",
    value: "60FPS",
    itemClass: "text-primary",
  },
  {
    label: "NET_LOAD",
    value: "120ms",
  },
  {
    label: "JS_HEAP",
    value: "24MB",
  },
  {
    label: "DEVICE_TYPE",
    value: "DESKTOP",
  },
];

const networkItems = [
  {
    label: "ONLINE",
    value: "NO LIMIT",
    clickable: true,
    action: "online",
  },
  {
    label: "SLOW",
    value: "400ms",
    clickable: true,
    action: "slow",
    itemClass: "text-warning",
  },
  {
    label: "OFFLINE",
    value: "DISCONNECT",
    clickable: true,
    action: "offline",
    itemClass: "text-error",
  },
];

const statusItems = [
  {
    label: "PRIMARY",
    value: "ACTIVE",
    itemClass: "text-primary",
  },
  {
    label: "SUCCESS",
    value: "ONLINE",
    itemClass: "text-success",
  },
  {
    label: "WARNING",
    value: "THROTTLED",
    itemClass: "text-warning",
  },
  {
    label: "ERROR",
    value: "FAILED",
    itemClass: "text-error",
  },
];

const longDiagnosticItems = Array.from({ length: 20 }, (_, i) => ({
  label: `METRIC_${String(i + 1).padStart(2, "0")}`,
  value: `${Math.floor(Math.random() * 1000)}`,
}));

const meta: Meta<typeof ReskitMenuCard> = {
  title: "Components/ReskitMenuCard",
  component: ReskitMenuCard,
  tags: ["autodocs"],

  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
HUD-style diagnostic card used throughout the Reskit device simulation platform.

Features:

- Diagnostic data display
- Action menus
- Clickable menu items
- Footer status information
- Custom status styling
- Event emission support
- Monospace HUD layout
        `,
      },
    },
  },

  decorators: [
    () => ({
      template: `
        <div style="padding: 24px; min-width: 320px;">
          <story />
        </div>
      `,
    }),
  ],

  args: {
    title: "SYSTEM_DIAGNOSTICS",
    footerText: "STATUS: NOMINAL",
    items: diagnosticItems,
    onItemClick: action("itemClick"),
  },

  argTypes: {
    title: {
      control: "text",
      description: "Card header title.",
    },
    footerText: {
      control: "text",
      description: "Optional footer text.",
    },
    items: {
      control: "object",
      description: "Collection of label/value pairs displayed within the card.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const DiagnosticsPanel: Story = {
  args: {
    title: "DIAGNOSTIC_FEED",
    footerText: "STATUS: NOMINAL",
    items: diagnosticItems,
  },
};
export const NetworkThrottlingMenu: Story = {
  args: {
    title: "NETWORK_THROTTLING",
    footerText: "SELECT PROFILE",
    items: networkItems,
  },
};
export const StatusVariants: Story = {
  args: {
    title: "STATUS_VARIANTS",
    footerText: "VISUAL_TEST",
    items: statusItems,
  },
};
export const FooterVisible: Story = {
  args: {
    title: "SYSTEM_HEALTH",
    footerText: "STATUS: NOMINAL",
    items: diagnosticItems,
  },
};
export const NoFooter: Story = {
  args: {
    title: "SYSTEM_HEALTH",
    footerText: "",
    items: diagnosticItems,
  },
};
export const LongDiagnostics: Story = {
  decorators: [
    () => ({
      template: `
        <div style="padding:24px; width:350px; max-height:600px; overflow:auto;">
          <story />
        </div>
      `,
    }),
  ],

  args: {
    title: "EXTENDED_MONITORING",
    footerText: "STREAM_ACTIVE",
    items: longDiagnosticItems,
  },
};

export const EmptyMenu: Story = {
  args: {
    title: "NO_DATA_AVAILABLE",
    footerText: "",
    items: [],
  },
};

export const Playground: Story = {
  args: {
    title: "PLAYGROUND",
    footerText: "INTERACTIVE_MODE",
    items: networkItems,
  },
};
export const HoverState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Hover over menu items to verify interactive highlighting, tooltip styles, and text color changes.",
      },
    },
  },

  args: {
    title: "INTERACTIVE_ACTIONS",
    footerText: "HOVER_TO_TEST",
    items: networkItems,
  },
};
