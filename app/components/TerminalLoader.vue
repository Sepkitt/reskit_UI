<template>
  <div class="terminal-loader">
    <div class="blueprint-scanner"></div>
    <div class="terminal-header d-flex justify-space-between font-mono mb-2">
      <span class="text-primary">SECURE_BOOT_V2</span>
      <span class="text-primary">{{ bootPercent }}%</span>
    </div>
    <div class="logs font-mono">
      <div v-for="(log, i) in bootLogs" :key="i" class="log-line">
        <span class="text-primary">></span> {{ log }}
      </div>
      <div v-if="bootLogs.length > 0" class="cursor">_</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  bootPercent: String | Number,
  bootLogs: Array,
});
</script>

<style lang="scss" scoped>
// Fixed terminal width to be responsive
.terminal-loader {
  width: 90vw;
  max-width: 450px;
  background: rgba(var(--v-theme-surface), 0.8);
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
  padding: 20px;
  position: relative;
  backdrop-filter: blur(10px);

  .logs {
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
  }
}

.blueprint-scanner {
  width: 100%;
  height: 2px;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 0 20px rgb(var(--v-theme-primary));
  position: absolute;
  top: 0;
  animation: scan 2s infinite linear;
  z-index: 2;
}

@keyframes scan {
  0% {
    top: -20px;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

.log-line {
  font-size: 0.8rem;
  color: #fff;
  margin-bottom: 6px;
  font-family: monospace;
}
.cursor {
  display: inline-block;
  width: 8px;
  height: 15px;
  background: white;
  animation: blink 0.8s infinite;
  vertical-align: middle;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

.font-mono {
  font-family: monospace !important;
}
</style>
