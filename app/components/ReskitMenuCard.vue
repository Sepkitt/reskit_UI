<template>
  <div class="perf-menu-content font-mono">
    <div class="hud-header">{{ title }}</div>

    <div class="hud-body">
      <div
        class="hud-item text-text"
        v-for="(item, index) in items"
        :key="index"
        :class="{ 'hovered pa-2 tooltip-primary': hoveredIndex === index  }"
        @mouseenter="item.clickable ? hoveredIndex = index : ''"
        @mouseleave="item.clickable ?hoveredIndex = null : ''"
        :style="{ cursor: item.clickable ? 'pointer' : 'default' }"
        @click="onItemClick(item)"
      >
        <span class="label">{{ item.label }}</span>
        <span class="value" :class="item.itemClass">
          {{ item.value }}
        </span>
      </div>
    </div>

    <div class="hud-footer text-text" v-if="footerText">
      {{ footerText }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: Array,
  title: String,
  footerText: String,
});

const emit = defineEmits(["itemClick"]);
const hoveredIndex = ref(null)

const onItemClick = (item) => {
  if (item.clickable) item.clickable &&  emit("itemClick", item.action);
};
</script>

<style scoped lang="scss">
.perf-menu-content {
  min-width: 200px;
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
  padding: 12px;
  font-size: 0.7rem;

  .hud-header {
    border-bottom: 1px solid rgba(var(--v-theme-primary), 0.2);
    padding-bottom: 4px;
    margin-bottom: 8px;
    font-weight: bold;
    color: rgb(var(--v-theme-primary));
  }

  .hud-item {
    transition: color 0.1s ease-in-out 0.1s;
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    .label {
      opacity: 0.6;
    }
    .value {
      font-weight: 900;
    }
    // &.hovered {

    //   color: rgb(var(--v-theme-error)) !important;
    //   background-color: #007bff;


    // }
  }

  .hud-item.hovered {
    background-color: #007bff;
  color: white;
  }

  .hud-footer {
    margin-top: 8px;
    padding-top: 4px;
    border-top: 1px dashed rgba(var(--v-theme-primary), 0.2);
    font-size: 8px;
    opacity: 0.7;
    text-align: right;
  }
}
</style>
