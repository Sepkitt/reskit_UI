// Button.stories.ts
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Button from "./Button.vue";

const meta = {
  title: "Example/Button",
  // The component you're working on
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    backgroundColor: { control: "color" },
  },
} satisfies Meta<typeof Button>;

export default meta;
// Type helper to reduce boilerplate
type Story = StoryObj<typeof meta>;

// A story named Primary that renders `<Button primary label="Button" />`
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
};
