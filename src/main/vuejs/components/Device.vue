<template>
  <div ref="containerRef" class="device-viewport" @mousedown="startPan" @mousemove="onPan">
    <client-only>
      <v-fade-transition>
        <div v-if="isLoading" class="loader-overlay">
          <v-progress-circular indeterminate color="primary" size="64" width="6" />
        </div>
      </v-fade-transition>
    </client-only>

    <div class="scaling-wrapper" :style="wrapperStyles">
      <v-sheet elevation="24" class="device-frame">
        <div 
          v-if="finalScale > fitScale && panningLocked"
          class="pan-overlay"
          :class="{ 'is-dragging': isDragging }"
        />

        <iframe 
          ref="iframeRef"
          class="iframe-element" 
          :style="{ pointerEvents: (isDragging || (finalScale > fitScale && panningLocked)) ? 'none' : 'auto' }"
          @load="isLoading = false"
        />
      </v-sheet>
    </div>

    <v-fade-transition>
      <v-btn
        v-if="finalScale > fitScale"
        :icon="panningLocked ? 'mdi-hand-back-right' : 'mdi-cursor-default-click'"
        size="small"
        :color="panningLocked ? 'primary' : 'success'"
        class="interaction-toggle"
        @click="panningLocked = !panningLocked"
      />
    </v-fade-transition>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  height: { type: [String, Number], default: 1080 },
  width: { type: [String, Number], default: 1920 },
  src: { type: String, default: '' },
  zoom: { type: Number, default: 0 }
});

const containerRef = ref(null);
const iframeRef = ref(null); // Direct reference to the iframe
const displayDimensions = ref({ w: 0, h: 0 });
const isLoading = ref(true);
const panningLocked = ref(true);

// 1. Panning Logic
const isDragging = ref(false);
const pan = ref({ x: 0, y: 0 });
const startPos = ref({ x: 0, y: 0 });

const updateSize = () => {
  if (containerRef.value) {
    displayDimensions.value = {
      w: containerRef.value.offsetWidth,
      h: containerRef.value.offsetHeight
    };
  }
};

// 2. Optimized Scaling (Memoized)
const fitScale = computed(() => {
  if (displayDimensions.value.w === 0) return 0.2;
  const scaleW = (displayDimensions.value.w - 40) / Number(props.width);
  const scaleH = (displayDimensions.value.h - 40) / Number(props.height);
  return Math.min(scaleW, scaleH, 1);
});

const finalScale = computed(() => {
  return props.zoom === 0 ? fitScale.value : Math.max(props.zoom, fitScale.value);
});

// 3. Efficiency Fix: Only update iframe SRC when it actually changes
// This prevents the iframe from flickering or reloading during pans/zooms
watch(() => props.src, (newVal) => {
  if (newVal && iframeRef.value) {
    isLoading.value = true;
    iframeRef.value.src = newVal; // Direct DOM manipulation is faster for iframes
  }
}, { immediate: false });

const startPan = (e) => {
  if (!panningLocked.value || finalScale.value <= fitScale.value) return;
  isDragging.value = true;
  startPos.value = { x: e.clientX - pan.value.x, y: e.clientY - pan.value.y };
};

const onPan = (e) => {
  if (!isDragging.value) return;
  pan.value = { x: e.clientX - startPos.value.x, y: e.clientY - startPos.value.y };
};

const stopPan = () => { isDragging.value = false; };

onMounted(() => {
  updateSize();
  const observer = new ResizeObserver(updateSize);
  observer.observe(containerRef.value);
  window.addEventListener('mouseup', stopPan);
  
  // Set initial SRC manually to ensure loading state triggers correctly
  if (props.src && iframeRef.value) {
    iframeRef.value.src = props.src;
  }
});

onUnmounted(() => window.removeEventListener('mouseup', stopPan));

const wrapperStyles = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  // Use translate3d for GPU acceleration (smoother panning)
  transform: `translate3d(calc(-50% + ${pan.value.x}px), calc(-50% + ${pan.value.y}px), 0) scale(${finalScale.value})`,
  position: 'absolute',
  left: '50%',
  top: '50%',
  transformOrigin: 'center center',
  cursor: panningLocked.value && finalScale.value > fitScale.value ? (isDragging.value ? 'grabbing' : 'grab') : 'default',
  transition: isDragging.value ? 'none' : 'transform 0.2s ease-out'
}));
</script>

<style scoped lang="scss">
.device-viewport {
  width: 100%; height: 100%;
  position: relative; overflow: hidden;
  background: #121212; // Dark background helps iframe contrast
}

.loader-overlay {
  position: absolute; inset: 0;
  z-index: 100;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
}

.pan-overlay {
  position: absolute; inset: 0;
  z-index: 10;
  background: transparent;
}

.interaction-toggle {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 110;
}

.device-frame {
  width: 100%; height: 100%;
  border-radius: 8px; overflow: hidden;
  background: white; // Iframes usually expect a white base
  
  .iframe-element { 
    border: 0; width: 100%; height: 100%; 
    display: block; // Removes whitespace at bottom
  }
}
</style>