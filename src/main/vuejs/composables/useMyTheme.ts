// ~/composables/useMyTheme.ts
import { useTheme } from "vuetify";
import { useThemeStore } from "~/stores/themeStore";
import type { ColorKeys } from "~/plugins/vuetify"; // imported from Vuetify plugin

export default function useMyTheme() {
  const vuetifyTheme = useTheme();
  const themeStore = useThemeStore();

  // Computed theme name based on Pinia store
  const currentTheme = computed(() =>
    themeStore.isDark ? "darkTheme" : "lightTheme"
  );

  // Sync Vuetify theme with Pinia store
   const toggleTheme = () => {
    themeStore.toggleTheme();
    vuetifyTheme.change(currentTheme.value);
  };
  // Reactive flag
  const isDark = computed(() => themeStore.isDark);

  // Reactive colors for the current theme
  const colors = computed<Record<ColorKeys, string>>(() => {
    return vuetifyTheme.themes.value[currentTheme.value]
      ?.colors as unknown as Record<ColorKeys, string>;
  });

  // Minimal helper to get a color by key
  function themeColor(key: ColorKeys): string {
    return colors.value[key];
  }

  return { isDark, toggleTheme, colors, themeColor };
}
