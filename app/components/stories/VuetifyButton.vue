<template>
  <v-btn
    :color="primary ? 'primary' : undefined"
    :variant="primary ? 'flat' : 'outlined'"
    :size="vuetifySize"
    :style="buttonStyle"
    @click="emit('click', 1)"
  >
    {{ label }}
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  primary?: boolean
  label: string
  size?: 'small' | 'medium' | 'large'
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  primary: false,
  size: 'medium',
  backgroundColor: undefined,
})

const emit = defineEmits<{
  (e: 'click', id: number): void
}>()

const vuetifySize = computed(() => {
  switch (props.size) {
    case 'small':
      return 'small'
    case 'large':
      return 'large'
    default:
      return 'default'
  }
})

const buttonStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
}))
</script>