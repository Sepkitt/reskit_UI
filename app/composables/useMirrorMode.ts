// composables/useMirrorMode.ts

import { ref } from "vue";

export function useMirrorMode() {
  const mirrorEnabled = ref(false);
  const masterFrame = ref<number | null>(null);

  const frames = new Map<number, HTMLIFrameElement>();

  const registerFrame = (frameId: number, iframe: HTMLIFrameElement) => {
    frames.set(frameId, iframe);
  };

  const syncNavigation = (sourceFrameId: number, destinationUrl: string) => {
    if (!mirrorEnabled.value) return;

    if (masterFrame.value !== sourceFrameId) return;

    frames.forEach((iframe, frameId) => {
      if (frameId === sourceFrameId) return;

      try {
        if (iframe.src !== destinationUrl) {
          iframe.src = destinationUrl;
        }
      } catch (error) {
        console.warn(`[MirrorMode] Failed to sync frame ${frameId}`, error);
      }
    });
  };

  return {
    mirrorEnabled,
    masterFrame,
    registerFrame,
    syncNavigation,
  };
}
