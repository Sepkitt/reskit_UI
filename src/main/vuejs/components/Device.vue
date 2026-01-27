<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  height: { type: [String, Number], default: 1080 },
  width: { type: [String, Number], default: 1920 },
  screen: { type: String, default: 'laptop' },
  src: { type: String, default: 'https://nuxtjs.org/' },
});

const containerRef = ref(null);
const displayDimensions = ref({ w: 0, h: 0 });

const updateSize = () => {
  if (containerRef.value) {
    displayDimensions.value = {
      w: containerRef.value.offsetWidth,
      h: containerRef.value.offsetHeight
    };
  }
};

let observer = null;
onMounted(() => {
  updateSize();
  observer = new ResizeObserver(updateSize);
  observer.observe(containerRef.value);
});
onUnmounted(() => observer?.disconnect());

const dynamicScale = computed(() => {
  if (displayDimensions.value.w === 0) return 0.2;
  const padding = 40; 
  const availW = displayDimensions.value.w - padding;
  const availH = displayDimensions.value.h - padding;

  const scaleW = availW / Number(props.width);
  const scaleH = availH / Number(props.height);

  return Math.min(scaleW, scaleH, 1);
});

// Styles for the iframe wrapper
const wrapperStyles = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  transform: `translate(-50%, -50%) scale(${dynamicScale.value})`,
  transition: 'transform 0.3s ease-out',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transformOrigin: 'center center'
}));
</script>

<template>
  <div ref="containerRef" class="device-viewport">
    <div class="scaling-wrapper" :style="wrapperStyles">
      <v-sheet 
        elevation="24" 
        class="device-frame" 
        :width="width" 
        :height="height"
      >
        <iframe :src="src" class="iframe-element" />
      </v-sheet>
    </div>
  </div>
</template>

<style scoped lang="scss">
.device-viewport {
  /* This container occupies the space in your card */
  width: 100%;
  height: 100%;
  position: relative; /* Essential for absolute child */
  overflow: hidden; 
  background: rgba(var(--v-theme-on-surface), 0.05);
  display: block; /* Removed flex to avoid alignment conflicts with absolute child */
}

.scaling-wrapper {
  /* Dimensions and scale handled by computed wrapperStyles */
  pointer-events: auto;
}

.device-frame {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  display: flex;
  
  .iframe-element {
    border: 0;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    background: #fff;
  }
}
</style>