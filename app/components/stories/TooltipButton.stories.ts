import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { action } from "storybook/actions";

import TooltipButton from "../TooltipButton.vue";

const meta: Meta<typeof TooltipButton> = {
  title: "Components/TooltipButton",
  component: TooltipButton,
  tags: ["autodocs"],

  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
TooltipButton combines a Vuetify button with a tooltip to provide
icon-based actions with contextual help text.

Features:

- Theme-aware colors
- Multiple Vuetify variants
- Multiple tooltip positions
- Configurable density and size
- Disabled state support
- Click event emission
- Keyboard accessible tooltip interaction
        `,
      },
    },
  },

  args: {
    text: "Refresh Device",
    icon: "mdi-refresh",
    color: "primary",
    location: "bottom",
    variant: "tonal",
    density: "comfortable",
    size: "default",
    disabled: false,
    onClick: action("click"),
  },

  argTypes: {
    text: {
      control: "text",
      description: "Tooltip text.",
    },

    icon: {
      control: "text",
      description: "Material Design icon.",
    },

    color: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "error"],
    },

    location: {
      control: "select",
      options: ["top", "bottom", "start", "end"],
    },

    variant: {
      control: "select",
      options: ["flat", "tonal", "outlined", "elevated", "text", "plain"],
    },

    density: {
      control: "select",
      options: ["default", "comfortable", "compact"],
    },

    size: {
      control: "select",
      options: ["x-small", "small", "default", "large"],
    },

    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ColorVariants: Story = {
  render: () => ({
    components: { TooltipButton },

    template: `
      <div class="d-flex gap-4 flex-wrap">
        <TooltipButton
          text="Primary Action"
          icon="mdi-star"
          color="primary"
        />

        <TooltipButton
          text="Secondary Action"
          icon="mdi-star"
          color="secondary"
        />

        <TooltipButton
          text="Success Action"
          icon="mdi-check"
          color="success"
        />

        <TooltipButton
          text="Warning Action"
          icon="mdi-alert"
          color="warning"
        />

        <TooltipButton
          text="Error Action"
          icon="mdi-close"
          color="error"
        />
      </div>
    `,
  }),
};

export const TooltipPositions: Story = {
  render: () => ({
    components: { TooltipButton },

    template: `
      <div class="d-flex gap-4">
        <TooltipButton
          text="Top Tooltip"
          location="top"
          icon="mdi-arrow-up"
        />

        <TooltipButton
          text="Bottom Tooltip"
          location="bottom"
          icon="mdi-arrow-down"
        />

        <TooltipButton
          text="Start Tooltip"
          location="start"
          icon="mdi-arrow-left"
        />

        <TooltipButton
          text="End Tooltip"
          location="end"
          icon="mdi-arrow-right"
        />
      </div>
    `,
  }),
};

export const ButtonVariants: Story = {
  render: () => ({
    components: { TooltipButton },

    template: `
      <div class="d-flex gap-4 flex-wrap">
        <TooltipButton
          text="Flat"
          icon="mdi-shape"
          variant="flat"
        />

        <TooltipButton
          text="Tonal"
          icon="mdi-shape"
          variant="tonal"
        />

        <TooltipButton
          text="Outlined"
          icon="mdi-shape"
          variant="outlined"
        />

        <TooltipButton
          text="Elevated"
          icon="mdi-shape"
          variant="elevated"
        />

        <TooltipButton
          text="Text"
          icon="mdi-shape"
          variant="text"
        />

        <TooltipButton
          text="Plain"
          icon="mdi-shape"
          variant="plain"
        />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    text: "Disabled Action",
    icon: "mdi-lock",
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => ({
    components: { TooltipButton },

    template: `
      <div class="d-flex align-center gap-4">
        <TooltipButton
          text="Extra Small"
          icon="mdi-magnify"
          size="x-small"
        />

        <TooltipButton
          text="Small"
          icon="mdi-magnify"
          size="small"
        />

        <TooltipButton
          text="Default"
          icon="mdi-magnify"
          size="default"
        />

        <TooltipButton
          text="Large"
          icon="mdi-magnify"
          size="large"
        />
      </div>
    `,
  }),
};

export const DensityVariants: Story = {
  render: () => ({
    components: { TooltipButton },

    template: `
      <div class="d-flex gap-4">
        <TooltipButton
          text="Default Density"
          icon="mdi-view-grid"
          density="default"
        />

        <TooltipButton
          text="Comfortable Density"
          icon="mdi-view-grid"
          density="comfortable"
        />

        <TooltipButton
          text="Compact Density"
          icon="mdi-view-grid"
          density="compact"
        />
      </div>
    `,
  }),
};

