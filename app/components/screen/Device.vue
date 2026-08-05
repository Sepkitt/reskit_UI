<template>
  <div
    ref="containerRef"
    class="device-viewport"
    tabindex="-1"
    @mousedown="startPan"
    @mousemove="onPan"
  >
    <v-fade-transition>
      <v-container v-if="isLoading" class="loader-overlay">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        />
        <div class="mt-4 text-overline text-text">
          Establishing Connection...
        </div>
      </v-container>
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
          <v-fade-transition>
            <div
              v-if="isLoading"
              class="loading-curtain blueprint-grid-pattern"
            >
              <div class="scan-line"></div>
            </div>
          </v-fade-transition>

          <div
            v-if="isPanActive"
            class="pan-overlay"
            :class="{ 'is-dragging': isDragging }"
          />
          <div class="iframe-wrapper" style="height: 100%; width: 100%">
            <div
              v-if="
                !props.src ||
                props.src === 'https://' ||
                props.src === 'about:blank'
              "
              style="
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 10;
              "
            >
              <EmptyState :is-mobile="props.width < 600" />
            </div>
            <iframe
              v-if="renderIframe"
              :key="iframeKey"
              ref="iframeRef"
              :src="props.src"
              class="iframe-element transition-opacity holds-the-frame"
              :class="{ 'opacity-0': isLoading }"
              @load="handleIframeLoad"
              @error="handleIframeError"
            />
          </div>
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
      <div class="d-flex fill-height slider-controls">
        <slot name="content" v-bind="props" />

        <div v-if="props.zoom !== 0" class="device-controls mr-2">
          <v-chip
            :class="isPanActive ? 'tooltip-success' : 'tooltip-secondary'"
            :color="isPanActive ? 'success' : 'secondary '"
            class="tooltip-btn"
          >
            {{
              isDragging
                ? "Dragging..."
                : isPanActive
                  ? "Hand Tool Active"
                  : `${Math.round((zoom + 1) * 100)}%`
            }}
          </v-chip>

          <div class="d-flex flex-column gap-2">
            <TooltipButton
              text="Refresh Device"
              size="large"
              variant="tonal"
              color="warning"
              class="mb-2"
              location="left"
              icon="mdi-refresh"
              @click="resetAndRefresh"
            >
            </TooltipButton>

            <TooltipButton
              :text="
                panningLocked ? 'Click to Disable Panning' : 'Enable Panning'
              "
              size="large"
              :color="panningLocked ? 'success' : 'info'"
              :icon="
                panningLocked
                  ? 'mdi-hand-back-right'
                  : 'mdi-cursor-default-click'
              "
              class="mb-2"
              variant="tonal"
              location="left"
              icon="mdi-refresh"
              @click="panningLocked = !panningLocked"
            />
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
const renderIframe = ref(true);
const isDragging = ref(false);
const pan = ref({ x: 0, y: 0 });
const startPos = ref({ x: 0, y: 0 });

const iframeKey = ref(0);

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
  const padding = 60;
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

const resetAndRefresh = async () => {
  pan.value = { x: 0, y: 0 };
  emit("update:zoom", 0);

  isLoading.value = true;
  iframeKey.value++;

  // Safety Timeout
  setTimeout(() => {
    if (isLoading.value) isLoading.value = false;
  }, 8000);
};

const handleIframeLoad = () => {
  isLoading.value = false;
};

const handleIframeError = () => {
  isLoading.value = false;
  console.error("iframe failed to load");
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

watch(
  () => props.src,
  (newSrc) => {
    if (newSrc && newSrc !== "https://" && newSrc !== "about:blank") {
      isLoading.value = true;
      console.log("iframe src changed to:", newSrc);
    }
  },
  { immediate: true },
);

// Lifecycle
onMounted(() => {
  updateSize();
  const observer = new ResizeObserver(updateSize);
  observer.observe(containerRef.value);
  window.addEventListener("mouseup", stopPan);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // Start loading timer
  const loadTimer = setTimeout(() => {
    if (isLoading.value) {
      console.warn("iframe taking longer than expected");
      // You could show a different UI state here
    }
  }, 5000);

  // Return a cleanup function that will run on unmount
  return () => {
    clearTimeout(loadTimer);
    observer.disconnect();
  };
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-baseCard), 80%);
  backdrop-filter: blur(12px);
}

.browser-shell {
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px  rgb(var(--v-theme-background));
  outline: 2px solid rgb(var(--v-theme-primary)) !important;
  /* CHANGE THIS: Use the theme surface or transparent so it doesn't flash white */
  background: rgb(var(--v-theme-surface));
  width: 100%;
  height: 100%;

  &.safari {
    /* Ensure Safari mode also doesn't have a white base */
    background: rgb(var(--v-theme-surface));
  }
}

/* Ensure the curtain is high enough z-index to cover everything */
.loading-curtain {
  position: absolute;
  inset: 0;
  z-index: 20; /* Bump this up */
  background-color: rgb(var(--v-theme-surface));
  background-image: radial-gradient(
    rgba(var(--v-theme-primary), 0.1) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
}
.device-frame {
  
  position: relative;
  background-color: rgb(var(--v-theme-surface));
  background-image: radial-gradient(
    rgba(var(--v-theme-primary), 0.1) 1px,
    transparent 1px
  );
  background-size: 20px 20px;

  overflow: hidden;
  flex-grow: 1;

  .iframe-element {
    background-color: transparent;
    border: 0;
    width: stretch;
    height: 100%;
    margin-left: -10px;
    display: block;
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
  .holds-the-frame {
       

    //  background: url('https://media.tenor.com/Pq1cZiuhlEEAAAAi/rajinikanth.gif')
    //    center center no-repeat;
    background-size: contain;
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
   bottom: 10px;
   height:95%;
  right: 15px;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    to bottom,
    rgba(var(--v-theme-primary), 0),
    rgba(var(--v-theme-primary), 0.5),
    rgba(var(--v-theme-primary), 0)
  );
  box-shadow: 0 0 15px rgba(var(--v-theme-primary), 0.5);
  z-index: 5;
  animation: scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; // Smoother movement
  // Add a trail effect
  &::after {
    content: "";
    position: absolute;
    top: -100px;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(
      to top,
      rgba(var(--v-theme-primary), 0.1),
      transparent
    );
  }
}

@keyframes scan {
  0% {
    top: 0%;
  }
  100% {
    top: 100%;
  }
}
.transition-opacity {
  transition: opacity 0.5s ease-in-out;
}

.opacity-0 {
  opacity: 0 !important;
  visibility: hidden !important; /* Prevents the "white box" paint */
  transition:
    opacity 0.5s ease-in-out,
    visibility 0.5s;
}

.v-enter-active,
.v-leave-active {
  transition:
    opacity 0.6s ease,
    filter 0.6s ease;
}

.v-leave-to {
  opacity: 0;
  filter: blur(10px); /* Makes the curtain melt away */
}

//empty State
</style>
