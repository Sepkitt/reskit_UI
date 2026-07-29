<template>
  <v-tooltip
    :location="location"
    :content-class="`custom-themed-tooltip tooltip-${color}`"
  >
    <template v-slot:activator="{ props: tooltipProps }">
      <v-btn
        v-bind="{ ...$attrs, ...tooltipProps }" 
        :icon="icon"
        :color="color"
        :variant="variant"
        :density="density"
        :size="size"
        :disabled="disabled"
        class="rounded-lg  tooltip-btn"
        :class="` tooltip-${color}`"
        @click.stop="emit('click', $event)"
      />
    </template>
    <span :class="`text-${color}`"> <v-icon :class="`text-${color}-lighten-1`" class="mx-2">{{icon}}</v-icon>{{ text }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
interface Props {
  text: string
  icon: string
  color?: string
  location?: 'top' | 'bottom' | 'start' | 'end'
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  density?: 'default' | 'comfortable' | 'compact'
  size?: 'default' | 'x-small' | 'small' | 'large'
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
  location: 'bottom',
  variant: 'tonal',
  density: 'comfortable',
  disabled: false
})

const emit = defineEmits(['click'])
</script>