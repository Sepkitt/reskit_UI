import type { StorybookConfig } from "@storybook/vue3-vite";
import { mergeConfig } from "vite";
import vue from "@vitejs/plugin-vue"; 
import vuetify from "vite-plugin-vuetify";

const config: StorybookConfig = {
  stories: [
    "../app/components/**/*.mdx",
    "../app/components/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: ["@storybook/addon-essentials", "@storybook/addon-mdx-gfm"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  // Use viteFinal to inject the Vue plugin
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        vue({
          // Enable features needed for Nuxt 3/4 or Vue 3.3+
          script: {
            defineModel: true,
            propsDestructure: true,
          },
          template: {
            compilerOptions: {
              // Treat Nuxt components as custom elements if needed
              isCustomElement: (tag) => tag.startsWith("nuxt-"),
            },
          },
        }),
        vuetify({ autoImport: true }),
      ],
      resolve: {
        alias: {
          // Ensure Nuxt aliases work
          "#components": "./app/components",
          "#imports": "./.nuxt/imports",
          "~": ".",
          "@": ".",
        },
      },
    });
  },
};
export default config;
