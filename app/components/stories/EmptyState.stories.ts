import type { Meta, StoryObj } from "@storybook/vue3-vite";
import EmptyState from "../screen/EmptyState.vue";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isMobile: {
      control: "boolean",
      description: "Displays the mobile variant of the empty state.",
    },
  },
  decorators: [
    () => ({
      template: `
        <div
          style="
            position: relative;
            width: 100%;
            height: 600px;
            overflow: hidden;
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

export const Default: Story = {
  args: {
    isMobile: false,
  },
};

export const Desktop: Story = {
  args: {
    isMobile: false,
  },
};

export const Mobile: Story = {
  args: {
    isMobile: true,
  },
};

export const Playground: Story = {
  args: {
    isMobile: false,
  },
};
