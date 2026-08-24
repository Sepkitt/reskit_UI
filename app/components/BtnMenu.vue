<template>
  <v-btn
    :icon="isIcon"
    :color="color"
    class="tooltip-success"
    :variant="variant"
    :size="size"
    :disabled="disabled"
  >
    <v-icon :icon="icon" :color="iconColor" />
    <v-menu activator="parent" :theme="$vuetify.theme.name">
      <v-list>
        <v-list-item
          v-if="$slots.content"
          :style="{
            backgroundColor: `rgb(var(--v-theme-${menuBackgroundColor}))`,
          }"
          3
        >
          <slot name="content" />
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
interface Props {
  icon?: string;
  color?: string;
  disabled?: boolean;
  iconColor?: string;
  size?: "x-small" | "small" | "default" | "large" | "x-large";
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  isIcon?: boolean;
  menuBackgroundColor?: string;
}

withDefaults(defineProps<Props>(), {
  icon: "mdi-dots-vertical",
  color: "primary",
  disabled: false,
  iconColor: "success",
  size: "small",
  variant: "tonal",
  isIcon: true,
  menuBackgroundColor: "background",
});
</script>

<style scoped></style>
