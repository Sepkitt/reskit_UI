import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref, computed } from "vue";
import BtnMenu from "../BtnMenu.vue";
const vuetifyColors = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "error",
  "surface",
  "white"
];

const meta: Meta<typeof BtnMenu> = {
  title: "Components/BtnMenu",
  component: BtnMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
A Vuetify-based overflow action menu that displays a vertical dots icon (mdi-dots-vertical)
and exposes a \`content\` slot for rendering menu items, actions, switches, or custom layouts.

The menu is activated by clicking the button and automatically handles focus and keyboard
navigation through Vuetify's accessibility features.
        `,
      },
    },
  },
  args: {
    icon: "mdi-dots-vertical",
    color: "primary",
    iconColor: "success",
    variant: "tonal",
    size: "small",
    disabled: false,
    isIcon: true,
    menuBackgroundColor: "background",
  },
  argTypes: {
    color: {
      control: "select",
      options: vuetifyColors,
    },

    iconColor: {
      control: "select",
      options: vuetifyColors,
    },

    variant: {
      control: "radio",
      options: ["flat", "text", "elevated", "tonal", "outlined", "plain"],
    },

    size: {
      control: "radio",
      options: ["x-small", "small", "default", "large", "x-large"],
    },

    disabled: {
      control: "boolean",
    },

    isIcon: {
      control: "boolean",
    },

    menuBackgroundColor: {
      control: "select",
      options: vuetifyColors,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground for testing button appearance, icon styling, and menu container styling.",
      },
    },
  },
};
export const WithActions: Story = {
  render: () => ({
    components: {
      BtnMenu,
    },
    template: `
      <BtnMenu>
        <template #content>
          <v-list density="compact">
            <v-list-item title="Edit" />
            <v-list-item title="Delete" />
            <v-list-item title="View Details" />
          </v-list>
        </template>
      </BtnMenu>
    `,
  }),
};
interface DeviceConfig {
  id: number;
  visible: boolean;
}

export const Content: Story = {
  render: () => ({
    components: { BtnMenu },
    setup() {
      const deviceConfigs = ref<DeviceConfig[]>([
        {
          id: 1,
          visible: true,
        },
        {
          id: 2,
          visible: true,
        },
      ]);

      const visibleDeviceConfigs = computed(() =>
        deviceConfigs.value.filter((config: DeviceConfig) => config.visible),
      );

      return {
        deviceConfigs,
        visibleDeviceConfigs,
      };
    },
    template: `
  <BtnMenu class="ml-1">
    <template #content>
      <div class="text-title-small text-grey py-1 px-4">
        Hide frame
      </div>

      <v-switch
        v-for="config in deviceConfigs"
        :key="config.id"
        v-model="config.visible"
        :label="'Frame ' + config.id"
        inset="square"
        true-icon="mdi-check"
        false-icon="mdi-close"
        density="comfortable"
        :disabled="visibleDeviceConfigs.length === 1 && config.visible"
        thumb-color="success"
        hide-details
      />
    </template>
  </BtnMenu>
`,
  }),
};

export const LongMenuList: Story = {
  render: () => ({
    components: { BtnMenu },
    template: `
      <BtnMenu>
        <template #content>
          <v-list density="compact">
            <v-list-item
              v-for="item in 15"
              :key="item"
              :title="\`Menu Item \${item}\`"
            />
          </v-list>
        </template>
      </BtnMenu>
    `,
  }),
};

export const CustomContent: Story = {
  render: () => ({
    components: { BtnMenu },
    template: `
      <BtnMenu>
        <template #content>
          <div class="pa-4" style="min-width: 220px">
            <div class="text-subtitle-1 font-weight-medium mb-2">
              User Actions
            </div>

            <v-btn
              block
              variant="text"
              color="primary"
              class="justify-start"
            >
              Profile
            </v-btn>

            <v-btn
              block
              variant="text"
              color="primary"
              class="justify-start"
            >
              Settings
            </v-btn>

            <v-divider class="my-2" />

            <v-btn
              block
              variant="text"
              color="error"
              class="justify-start"
            >
              Sign Out
            </v-btn>
          </div>
        </template>
      </BtnMenu>
    `,
  }),
};
