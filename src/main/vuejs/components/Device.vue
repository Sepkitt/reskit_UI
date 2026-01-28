<template>
  <div
    ref="containerRef"
    class="device-viewport"
    tabindex="-1"
    @mousedown="startPan"
    @mousemove="onPan"
  >
    <client-only>
      <v-fade-transition>
        <div v-if="isLoading" class="loader-overlay">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            width="6"
          />
          <div class="mt-4 text-overline text-white">Connecting...</div>
        </div>
      </v-fade-transition>
    </client-only>

    <div class="scaling-wrapper" :style="wrapperStyles">
      <div
        class="browser-shell"
        :class="[device?.browser || 'none']"
        :style="{
          paddingTop: device?.safeAreaTop ? `${device.safeAreaTop}px` : '0px',
          paddingBottom: device?.safeAreaBottom
            ? `${device.safeAreaBottom}px`
            : '0px',
        }"
      >
        <div
          v-if="showBrowserUI && device?.browser === 'safari'"
          class="safari-top-bar"
        >
          <div v-if="device?.safeAreaTop" class="dynamic-island"></div>

          <div class="url-pill">
            <v-icon size="x-small" class="mr-2">mdi-lock</v-icon>
            {{ displayUrl }}
          </div>
        </div>

        <v-sheet elevation="8" class="device-frame">
          <div
            v-if="isPanActive"
            class="pan-overlay"
            :class="{ 'is-dragging': isDragging }"
          />

          <iframe
            ref="iframeRef"
            class="iframe-element"
            :style="{ pointerEvents: isPanActive ? 'none' : 'auto' }"
            frameborder="0"
            scrolling="no" 
            marginheight="0"
            marginwidth="0"
            @load="isLoading = false"
          />
        </v-sheet>

        <div
          v-if="showBrowserUI && device?.browser === 'safari'"
          class="safari-bottom-bar"
        >
          <div class="d-flex justify-space-around w-100 px-4">
            <v-icon size="small">mdi-chevron-left</v-icon>
            <v-icon size="small">mdi-chevron-right</v-icon>
            <v-icon size="small">mdi-share-variant-outline</v-icon>
            <v-icon size="small">mdi-book-open-outline</v-icon>
            <v-icon size="small">mdi-tabs</v-icon>
          </div>

          <div v-if="device?.safeAreaBottom" class="home-indicator"></div>
        </div>
      </div>
    </div>

    <v-fade-transition>
      <div v-if="props.zoom !== 0" class="device-controls">
        <v-chip
          size="x-small"
          :color="isPanActive ? 'primary' : 'grey-darken-3'"
          variant="flat"
          class="mb-2 shadow-sm"
        >
          {{
            isDragging
              ? "Dragging..."
              : isPanActive
                ? "Hand Tool Active"
                : "Zoomed In"
          }}
        </v-chip>

        <div class="d-flex flex-column gap-2">
          <v-btn
            size="small"
            color="primary"
            elevation="4"
            icon
            @click="resetAndRefresh"
          >
            <v-icon size="small">mdi-refresh</v-icon>
            <v-tooltip activator="parent" location="left"
              >Reset & Refresh</v-tooltip
            >
          </v-btn>

          <v-btn
            size="small"
            :color="panningLocked ? 'primary' : 'secondary'"
            elevation="4"
            icon
            @click="panningLocked = !panningLocked"
          >
            <v-icon size="small">
              {{
                panningLocked
                  ? "mdi-hand-back-right"
                  : "mdi-cursor-default-click"
              }}
            </v-icon>
            <v-tooltip activator="parent" location="left">
              {{ panningLocked ? "Unlock Interaction" : "Lock Panning Mode" }}
            </v-tooltip>
          </v-btn>
        </div>
      </div>
    </v-fade-transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  height: { type: [String, Number], default: 1080 },
  width: { type: [String, Number], default: 1920 },
  src: { type: String, default: "" },
  zoom: { type: Number, default: 0 },
  device: { type: Object, default: () => ({ browser: "none" }) },
  showBrowserUI: { type: Boolean, default: true },
});

const emit = defineEmits(["update:zoom"]);

const containerRef = ref(null);
const iframeRef = ref(null);
const isLoading = ref(true);
const panningLocked = ref(false);
const spacePressed = ref(false);
const displayDimensions = ref({ w: 0, h: 0 });

const isDragging = ref(false);
const pan = ref({ x: 0, y: 0 });
const startPos = ref({ x: 0, y: 0 });

// Reset pan when zoom hits 0
watch(
  () => props.zoom,
  (newVal) => {
    if (newVal === 0) {
      pan.value = { x: 0, y: 0 };
      panningLocked.value = false; // Turn off lock if we reset
    }
  },
);

const displayUrl = computed(() => {
  try {
    return new URL(props.src).hostname;
  } catch {
    return props.src;
  }
});

const isPanActive = computed(() => {
  return (panningLocked.value || spacePressed.value) && props.zoom !== 0;
});

const resetAndRefresh = () => {
  pan.value = { x: 0, y: 0 };
  emit("update:zoom", 0);
  if (iframeRef.value) {
    isLoading.value = true;
    const currentSrc = iframeRef.value.src;
    iframeRef.value.src = "about:blank";
    setTimeout(() => {
      iframeRef.value.src = currentSrc;
    }, 50);
  }
};

const updateSize = () => {
  if (containerRef.value) {
    displayDimensions.value = {
      w: containerRef.value.offsetWidth,
      h: containerRef.value.offsetHeight,
    };
  }
};

const fitScale = computed(() => {
  if (displayDimensions.value.w === 0) return 0.2;
  
  const uiHeight = props.showBrowserUI && props.device?.browser === 'safari' ? 110 : 0;
  const safeArea = (props.device?.safeAreaTop || 0) + (props.device?.safeAreaBottom || 0);
  
  // Add a 1px buffer to the internal height calculation
  const totalInternalHeight = Number(props.height) + uiHeight + safeArea + 1;
  const totalInternalWidth = Number(props.width);

  const padding = 60; // Slightly more padding helps the "illusion"
  const scaleW = (displayDimensions.value.w - padding) / totalInternalWidth;
  const scaleH = (displayDimensions.value.h - padding) / totalInternalHeight;
  
  // Multiply by 0.999 to avoid sub-pixel rounding issues that trigger scrollbars
  return Math.min(scaleW, scaleH, 1) * 0.999;
});

const finalScale = computed(() =>
  props.zoom === 0 ? fitScale.value : props.zoom,
);

watch(
  () => props.src,
  (newVal) => {
    if (newVal && iframeRef.value) {
      isLoading.value = true;
      iframeRef.value.src = newVal;
    }
  },
);

const startPan = (e) => {
  if (!isPanActive.value) return;
  isDragging.value = true;
  startPos.value = { x: e.clientX - pan.value.x, y: e.clientY - pan.value.y };
};

const onPan = (e) => {
  if (!isDragging.value) return;
  pan.value = {
    x: e.clientX - startPos.value.x,
    y: e.clientY - startPos.value.y,
  };
};

const stopPan = () => {
  isDragging.value = false;
};

const handleKeyDown = (e) => {
  if (e.code === "Space") {
    const activeEl = document.activeElement.tagName;
    if (activeEl === "INPUT" || activeEl === "TEXTAREA") return;

    e.preventDefault();
    spacePressed.value = true;
    if (containerRef.value) containerRef.value.focus();
  }
};

const handleKeyUp = (e) => {
  if (e.code === "Space") spacePressed.value = false;
};

onMounted(() => {
  updateSize();
  const observer = new ResizeObserver(updateSize);
  observer.observe(containerRef.value);

  window.addEventListener("mouseup", stopPan);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  if (props.src && iframeRef.value) iframeRef.value.src = props.src;
});

onUnmounted(() => {
  window.removeEventListener("mouseup", stopPan);
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});

const wrapperStyles = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  transform: `translate3d(calc(-50% + ${pan.value.x}px), calc(-50% + ${pan.value.y}px), 0) scale(${finalScale.value})`,
  position: "absolute",
  left: "50%",
  top: "50%",
  transformOrigin: "center center",
  cursor: isPanActive.value
    ? isDragging.value
      ? "grabbing"
      : "grab"
    : "default",
  transition: isDragging.value
    ? "none"
    : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
}));
</script>

<style scoped lang="scss">
.device-viewport {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  outline: none;
}

.loader-overlay {
  position: absolute;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
}

.scaling-wrapper {
  z-index: 5;
}

.browser-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.5); // One strong shadow for the whole device
  // Ensure the shell doesn't grow beyond the width/height defined by props
  box-sizing: border-box;

  &.safari {
    border: 10px solid #222;
    border-radius: 35px;
    background: #f4f4f4;
    .safari-top-bar {
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      .url-pill {
        background: rgba(0, 0, 0, 0.05);
        width: 60%;
        border-radius: 6px;
        font-size: 10px;
        text-align: center;
        padding: 3px;
        color: #555;
      }
    }
    .safari-bottom-bar {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      color: #007aff;
      padding-bottom: 10px;
    }
  }
}

.device-frame { 
  flex-grow: 1; 
  position: relative; 
  background: white; 
  overflow: hidden; 
  display: flex;       // Add this
  flex-direction: column; // Add this
  
  .iframe-element { 
    border: 0;
    width: 100%; 
    height: 100%; 
    flex: 1 1 auto;    // Force it to fill exactly
    display: block;
    
    /* This is the secret sauce for Chromium browsers */
    &::-webkit-scrollbar {
      display: none;
      width: 0 !important;
    }
  }
}
.pan-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  &.is-dragging {
    background: rgba(var(--v-theme-primary), 0.05);
  }
}

.device-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 110;
  gap: 8px;
}

.safari-top-bar {
  height: 45px;
  display: flex;
  align-items: flex-end; // Pushes the URL bar down to make room for the island
  justify-content: center;
  padding-bottom: 8px;
  position: relative;

  .dynamic-island {
    position: absolute;
    top: -35px; // Positions it within the device's top bezel/padding
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 35px;
    background: #000;
    border-radius: 20px;
  }
}

.safari-bottom-bar {
  height: 65px; // Increased slightly to accommodate indicator
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .home-indicator {
    width: 130px;
    height: 5px;
    background: #000;
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 5px;
  }
}
</style>
