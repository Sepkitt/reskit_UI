import type { Meta, StoryObj } from "@storybook/vue3-vite";
import VuetifyButton from "./VuetifyButton.vue";

const meta: Meta<typeof VuetifyButton> = {
  title: "Example/VuetifyButton",
  component: VuetifyButton,
  tags: ["autodocs"],
  argTypes: {
    primary: {
      control: "boolean",
    },
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
    },
    backgroundColor: {
      control: "color",
    },
    // click: {
    //   action: "clicked",
    // },
  },
  args: {
    label: "Button",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
    label: "Secondary Button",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    label: "Large Button",
  },
};

export const Small: Story = {
  args: {
    size: "small",
    label: "Small Button",
  },
};

export const CustomBackground: Story = {
  args: {
    label: "Custom Color",
    backgroundColor: "#ff9800",
  },
};
