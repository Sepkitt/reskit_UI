<template>
  <div
    ref="containerRef"
    class="device-viewport"
    tabindex="-1"
    @mousedown="startPan"
    @mousemove="onPan"
  >
      <v-fade-transition>
        <div v-if="isLoading" class="loader-overlay">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
            width="4"
          />
        </div>
      </v-fade-transition>

    <div class="scaling-wrapper" :style="wrapperStyles">
      <div class="browser-shell" :class="[device?.browser || 'none']">
        <div
          v-if="showBrowserUI && device?.browser === 'safari'"
          class="safari-top-bar"
        >
          <div class="url-pill">
            <v-icon size="x-small" color="grey-darken-1" class="mr-2"
              >mdi-lock</v-icon
            >
            <span class="url-text">{{ displayUrl }}</span>
          </div>
        </div>

        <div class="device-frame" :style="frameDimensions">
          <div
            v-if="isPanActive"
            class="pan-overlay"
            :class="{ 'is-dragging': isDragging }"
          />

          <iframe
            ref="iframeRef"
            :src="props.src"
            class="iframe-element"
            :style="{ pointerEvents: isPanActive ? 'none' : 'auto' }"
            @load="isLoading = false"
          />
        </div>

        <div
          v-if="showBrowserUI && device?.browser === 'safari'"
          class="safari-bottom-bar"
        >
          <div class="safari-actions">
            <v-icon size="small" color="grey-darken-1">mdi-chevron-left</v-icon>
            <v-icon size="small" color="grey-darken-1"
              >mdi-chevron-right</v-icon
            >
            <v-icon size="small" color="grey-darken-1"
              >mdi-share-variant-outline</v-icon
            >
            <v-icon size="small" color="grey-darken-1"
              >mdi-book-open-outline</v-icon
            >
            <v-icon size="small" color="grey-darken-1">mdi-tabs</v-icon>
          </div>
        </div>
      </div>
    </div>

    <v-fade-transition>
      <div class="slider-controls">
        <slot name="content" v-bind="props" />

        <div v-if="props.zoom !== 0" class="device-controls">
          <v-chip
            :class="isPanActive ? 'tooltip-success' : 'tooltip-secondary'"
            :color="isPanActive ? 'success' : 'secondary '"
            class="shadow-sm"
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
              color="secondary"
              class="mb-2"
              icon
              elevation="4"
              @click="resetAndRefresh"
            >
              <v-icon >mdi-refresh</v-icon>
            </v-btn>

            <v-btn
              size="small"
              :color="panningLocked ? 'success' : 'white'"
              icon
              elevation="4"
              @click="panningLocked = !panningLocked"
            >
              <v-icon >
                {{
                  panningLocked
                    ? "mdi-hand-back-right"
                    : "mdi-cursor-default-click"
                }}
              </v-icon>
            </v-btn>
          </div>
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

// Watchers
watch(
  () => props.zoom,
  (newVal) => {
    if (newVal === 0) {
      pan.value = { x: 0, y: 0 };
      panningLocked.value = false;
    }
  },
);

// Computeds
const displayUrl = computed(() => {
  try {
    return new URL(props.src).hostname;
  } catch {
    return props.src;
  }
});

const isPanActive = computed(
  () => (panningLocked.value || spacePressed.value) && props.zoom !== 0,
);

const totalDeviceWidth = computed(() => Number(props.width));

const totalDeviceHeight = computed(() => {
  let extra = 0;
  if (props.showBrowserUI && props.device?.browser === "safari") {
    extra += 40; // Top bar height
    extra += 44; // Bottom bar height
  }
  return Number(props.height) + extra;
});

const fitScale = computed(() => {
  if (displayDimensions.value.w === 0) return 0.2;
  const padding = 80;
  const scaleW = (displayDimensions.value.w - padding) / totalDeviceWidth.value;
  const scaleH =
    (displayDimensions.value.h - padding) / totalDeviceHeight.value;
  return Math.min(scaleW, scaleH, 1) * 0.999;
});

const finalScale = computed(() =>
  props.zoom === 0 ? fitScale.value : props.zoom,
);

const wrapperStyles = computed(() => ({
  width: `${totalDeviceWidth.value}px`,
  height: `${totalDeviceHeight.value}px`,
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

const frameDimensions = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
}));

// Methods
const updateSize = () => {
  if (containerRef.value) {
    displayDimensions.value = {
      w: containerRef.value.offsetWidth,
      h: containerRef.value.offsetHeight,
    };
  }
};

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

// Lifecycle
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
</script>

<style scoped lang="scss">
.device-viewport {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  outline: none;
  background: transparent;
}

.loader-overlay {
  position: absolute;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
}

.browser-shell {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;

  &.safari {
    background: #f9f9f9;
  }
}

.device-frame {
  position: relative;
  background: white;
  overflow: hidden;
  flex-grow: 1;

  .iframe-element {
    border: 0;
    width: calc(100% + 20px);
    height: 100%;
    margin-left: -10px;
    display: block;
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
}

.pan-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  cursor: inherit;
  &.is-dragging {
    background: rgba(var(--v-theme-primary), 0.02);
  }
}

.safari-top-bar {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f1f1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  flex-shrink: 0;

  .url-pill {
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    padding: 2px 12px;
    border-radius: 6px;
    font-size: 11px;
    width: 60%;
    text-align: center;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.safari-bottom-bar {
  height: 44px;
  background: #f1f1f1;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  display: flex;
  align-items: center;

  .safari-actions {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 0 16px;
    .v-icon {
      opacity: 0.6;
    }
  }
}

.device-controls {
  position: absolute;
  bottom: 1rem;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 110;
  align-items: flex-end;
}

.slider-controls {
  position: absolute;
  bottom: 24px;
  right: 24px;
}
</style>
