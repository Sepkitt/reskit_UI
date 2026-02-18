<script setup>
import { useTemplateRef } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  items: {
    type: Array,
    required: true,
  },
});

const selectRef = useTemplateRef("selectRef ");
const emit = defineEmits(["update:modelValue"]);

// Internal logic moved from parent to component
const getSimulatedLabel = (width) => {
  if (width >= 1200) return "Desktop";
  if (width >= 768) return "Tablet";
  return "Mobile";
};

const onDeviceChange = (val) => {
  emit("update:modelValue", val);
};

// Expose to parent
defineExpose({ selectRef });
</script>

<template>
  <v-select
    :model-value="modelValue"
    @update:model-value="onDeviceChange"
    :items="items"
    item-title="name"
    return-object
    density="compact"
    variant="outlined"
    base-color="primary"
    hide-details
    ref="selectRef "
    class="device-select-refined tooltip-btn"
    color="primary" style="--v-field-color: white;"
    :menu-props="{ contentClass: 'selector-menu' }"
  >
    <template #selection="{ item }">
      <div class="d-flex align-center w-100">
        <span class="text-caption font-weight-bold text-primary mr-2">
          {{ getSimulatedLabel(item.raw.width) }}
        </span>
        <span class="text-caption font-weight-medium">
          {{ item.raw.name }}
        </span>
      </div>
    </template>

    <template #item="{ props: itemProps, item }">
      <v-list-item class="tooltip-primary" v-bind="itemProps" >
        <template #title>
          <div class="d-flex align-center justify-space-between">
            <span class="text-body-2">{{ item.raw.name }}</span>
            <div class="mini-label-badge ml-4">
              {{ getSimulatedLabel(item.raw.width) }}
            </div>
          </div>
        </template>
        <template #subtitle>
          <span class="text-grey">
            {{ item.raw.width }} × {{ item.raw.height }}
          </span>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<style scoped>
.device-select-refined {
  width: 100%;


}
.device-select-refined :deep(.v-field) {
  font-size: 0.85rem;
  font-weight: 500;
  
}
.mini-label-badge {
  font-size: 9px;
  font-weight: 900;
  padding: 1px 4px;
  border: 1px solid currentColor;
  border-radius: 3px;
  color: rgb(var(--v-theme-primary));
}



</style>
