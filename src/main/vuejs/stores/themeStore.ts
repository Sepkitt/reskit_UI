import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useNuxtApp } from "#app";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);

  if (import.meta.client) {
    isDark.value = localStorage.getItem("isDark") === "true";
  }

  function toggleTheme() {
    isDark.value = !isDark.value;
  }

  function setTheme(theme: "lightTheme" | "darkTheme") {
    isDark.value = theme === "darkTheme";
  }

  if (import.meta.client) {
    watch(isDark, (newVal) => {
      localStorage.setItem("isDark", newVal.toString());
    });
  }

  return { isDark, toggleTheme, setTheme };
});
