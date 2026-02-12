<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="400"
  >
    <v-card color="surface" class="rounded-xl border-themed">
      <v-card-text class="text-center pa-8">
        <div class="text-h5 font-weight-bold mb-2">Mobile Sync</div>
        <p class="text-body-2 text-medium-emphasis mb-6">
          Scan to test <span class="text-primary">{{ url }}</span>
        </p>

        <v-sheet
          elevation="12"
          class="mx-auto mb-6 pa-4 d-inline-block rounded-lg qr-container"
          :color="isDark ? '#FFFFFF' : '#F8FAFC'"
        >
          <qrcode-vue
            :value="url"
            :size="220"
            level="H"
            render-as="svg"
            :foreground="isDark ? '#192841' : '#000000'"
            background="#FFFFFF"
          />
        </v-sheet>

        <v-btn
          block
          size="large"
          color="primary"
          variant="tonal"
          class="rounded-pill"
          @click="$emit('update:modelValue', false)"
        >
          Got it
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
const props = defineProps<{
  modelValue: boolean;
  url: string;
  isDark: boolean;
}>();

defineEmits(["update:modelValue"]);
</script>

<style scoped></style>
