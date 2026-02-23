<template>
  <div class="perf-menu-content font-mono">
    <div class="hud-header">{{ title }}</div>

    <div class="hud-body">
      <!-- <div class="hud-item  text-text">
        <span class="label">RENDERING</span>
        <span class="value" :class="fps < 45 ? 'text-error' : 'text-primary'">
          {{ fps }} FPS
        </span>

        
      </div>
      <div class="hud-item  text-text">
        <span class="label">NET_LOAD</span>
        <span class="value">{{ loadTime }}ms</span>
      </div>
      <div class="hud-item  text-text" v-if="memory">
        <span class="label">JS_HEAP</span>
        <span class="value">{{ memory }}MB</span>
      </div> -->

      <div
        class="hud-item text-text"
        v-for="(item, index) in items"
        :key="index"
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
   footerText: String
  // loadTime: Number,
  // fps: Number,
  // memory: Number,
});


</script>

<style scoped lang="scss">
.perf-menu-content {
  width: 200px;
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
  padding: 12px;
  font-size: 10px;

  .hud-header {
    border-bottom: 1px solid rgba(var(--v-theme-primary), 0.2);
    padding-bottom: 4px;
    margin-bottom: 8px;
    font-weight: bold;
    color: rgb(var(--v-theme-primary));
  }

  .hud-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    .label {
      opacity: 0.6;
    }
    .value {
      font-weight: 900;
    }
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
