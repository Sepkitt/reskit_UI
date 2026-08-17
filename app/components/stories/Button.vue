<template>
  <button
    type="button"
    :class="[
      'storybook-button',
      `storybook-button--${size}`,
      { 'storybook-button--primary': primary },
    ]"
    :style="style"
    @click="emit('click', 1)"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  primary?: boolean;
  label: string;
  size?: "small" | "medium" | "large";
  backgroundColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  primary: false,
  size: "medium",
  backgroundColor: undefined,
});

const emit = defineEmits<{
  (e: "click", id: number): void;
}>();

const fontSize = {
  small: "12px",
  medium: "14px",
  large: "16px",
}[props.size];

const style = {
  backgroundColor: props.backgroundColor,
  fontSize,
};
</script>
<style scoped>
.storybook-button {
  font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  border: 0;
  border-radius: 3em;
  cursor: pointer;
  display: inline-block;
  line-height: 1;
  padding: 0.75rem 1.5rem;
  transition: background-color 0.2s ease-in-out;
}

.storybook-button--primary {
  color: white;
  background-color: #1ea7fd;
}

.storybook-button--secondary {
  color: #333;
  background-color: transparent;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
}

.storybook-button--small {
  padding: 0.5rem 1rem;
}

.storybook-button--large {
  padding: 1rem 2rem;
}
</style>
