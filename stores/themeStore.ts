import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore(
  "theme",
  () => {
    // 1. Initial State
    const isDark = ref(true);

    // 2. Actions
    function toggleTheme() {
      isDark.value = !isDark.value;
    }

    function setTheme(theme: "lightTheme" | "darkTheme") {
      isDark.value = theme === "darkTheme";
    }

    // 3. Return state and actions
    return { isDark, toggleTheme, setTheme };
  },
  {
    // 4. Persistence Configuration
    persist: true,
  },
);
