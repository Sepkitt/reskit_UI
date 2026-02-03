// ~/composables/useMyTheme.ts
import { computed, watch } from "vue";
import { useTheme } from "vuetify";
import { useThemeStore } from "~/stores/themeStore";
import type { ColorKeys } from "~/plugins/vuetify";

export default function useMyTheme() {
  const vuetifyTheme = useTheme();
  const themeStore = useThemeStore();

  // 1. Reactive theme name helper
  const currentThemeName = computed(() =>
    themeStore.isDark ? "darkTheme" : "lightTheme",
  );

  // 2. The Sync Watcher
  // Using .change() to satisfy the Vuetify upgrade warning
  watch(
    () => themeStore.isDark,
    () => {
      vuetifyTheme.change(currentThemeName.value);
    },
    { immediate: true },
  );

  // 3. Actions
  const toggleTheme = () => {
    themeStore.toggleTheme();
    // The watcher above picks up the change and runs vuetifyTheme.change()
  };

  // 4. Reactive Colors
  // vuetifyTheme.current is the safest way to grab the active palette
  const colors = computed<Record<ColorKeys, string>>(() => {
    return vuetifyTheme.current.value.colors as unknown as Record<
      ColorKeys,
      string
    >;
  });

  function themeColor(key: ColorKeys): string {
    return colors.value[key];
  }

  return {
    isDark: computed(() => themeStore.isDark),
    toggleTheme,
    colors,
    themeColor,
    currentTheme: currentThemeName,
  };
}
