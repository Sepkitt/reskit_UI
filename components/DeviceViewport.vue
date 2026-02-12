<template>
  <v-card
    :height="maxHeight"
    class="d-flex flex-column rounded-lg overflow-hidden border-themed"
    color="background"
    elevation="0"
  >
    <v-toolbar color="surface" density="" class="border-b px-2">
      <div class="simulated-label-container mr-2 py-2">
        <span class="text-uppercase font-weight-bold text-caption text-primary">{{ getSimulatedLabel(device.width) }}</span>
      </div>

      <v-spacer />

      <v-select
        :model-value="device"
        @update:model-value="$emit('update:device', $event)"
        :items="items"
        item-title="name"
        return-object
        density="compact"
        variant="outlined"
        base-color="primary"
        hide-details
        class="select-width-refined mx-4"
      >
        <template #selection="{ item }">
          <div class="d-flex align-center w-100">
            <span class="text-caption font-weight-bold text-primary mr-2">
              {{ getSimulatedLabel(item.raw.width) }}
            </span>
            <span class="text-caption font-weight-medium">{{
              item.raw.name
            }}</span>
          </div>
        </template>

        <template #item="{ props, item }">
          <v-list-item v-bind="props">
            <template #title>
              <div class="d-flex align-center justify-space-between">
                <span class="text-body-2">{{ item.raw.name }}</span>
                <div class="mini-label-badge ml-4">
                  {{ getSimulatedLabel(item.raw.width) }}
                </div>
              </div>
            </template>
            <template #subtitle>
              <span class="text-grey"
                >{{ item.raw.width }} × {{ item.raw.height }}</span
              >
            </template>
          </v-list-item>
        </template>
      </v-select>

      <v-btn
        :icon="
          rotate ? 'mdi-phone-rotate-landscape' : 'mdi-phone-rotate-portrait'
        "
        size="small"
        variant="text"
        :color="rotate ? 'primary' : 'default'"
        @click="$emit('update:rotate', !rotate)"
      />
    </v-toolbar>

    <div class="device-viewport-container blueprint-grid">
      <Device
        class="device-transition"
        :zoom="zoom"
        @update:zoom="$emit('update:zoom', $event)"
        :height="rotate ? device.width : device.height"
        :width="rotate ? device.height : device.width"
        :device="device"
        :src="src"
        show-browser-ui
      >
        <template #content>
          <v-slider
            :model-value="zoom"
            @update:model-value="$emit('update:zoom', $event)"
            append-icon="mdi-magnify-plus-outline"
            @click:append="$emit('update:zoom', Math.min(zoom + 1, 3))"
            max="3"
            step="1"
            density="compact"
            color="primary"
            direction="vertical"
            hide-details
            class="zoom-slider-ui"
          >
            <template #prepend>
              <v-btn
                icon="mdi-fit-to-screen"
                size="x-small"
                variant="flat"
                color="background"
                @click="$emit('update:zoom', 0)"
              />
            </template>
          </v-slider>
        </template>
      </Device>
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  device: Object,
  items: Array,
  zoom: Number,
  rotate: Boolean,
  src: String,
  maxHeight: String,
});

defineEmits(["update:device", "update:zoom", "update:rotate"]);

const getSimulatedLabel = (width) => {
  const w = Number(width);
  if (w >= 3840) return "4k";
  if (w >= 2560) return "2k";
  if (w >= 1904) return "xl";
  if (w >= 1264) return "lg";
  if (w >= 960) return "md";
  if (w >= 600) return "sm";
  return "xs";
};
</script>

<style scoped lang="scss">
/* Move your specialized device styles here */
.device-viewport-container {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  background-color: rgb(var(--v-theme-baseCard));
  --grid-color: rgba(var(--v-theme-outline), 0.15);
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 40px 40px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid rgb(var(--v-theme-primary));
    pointer-events: none;
    z-index: 5;
  }
  &::before {
    top: 10px;
    left: 10px;
    border-right: 0;
    border-bottom: 0;
  }
  &::after {
    bottom: 10px;
    right: 10px;
    border-left: 0;
    border-top: 0;
  }
}

.device-transition {
  transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1) !important;
  will-change: width, height, transform;
}

.simulated-label-container {
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 48px;
  height: 28px;
  padding: 0 10px;
  border-radius: 4px;

  border: 1px solid rgba(var(--v-theme-primary), 0.5);
  background-color: rgb(var(--v-theme-surface));

  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.15);
}

.v-theme--darkTheme .simulated-label-container {
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 2px 6px 0 rgba(0, 0, 0, 0.5);
}

.select-width-refined {
  /* Ensure the text matches the theme */
  :deep(.v-field) {
    font-size: 0.85rem;
    font-weight: 500;
  }
}

.mini-label-badge {
  font-size: 9px;
  font-weight: 900;
  padding: 1px 4px;
  border: 1px solid currentColor;
  border-radius: 3px;
  color: rgb(var(--v-theme-primary));
}

.device-transition {
  /* This animates width, height, and the zoom transform simultaneously */
  transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1) !important;

  /* Optimization to keep the animation buttery smooth */
  will-change: width, height, transform;
}
</style>
