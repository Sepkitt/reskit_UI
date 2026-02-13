<template>
  <v-app>
    <v-app-bar color="background" elevation="0" class="border-b">
      <div class="d-flex align-center px-4">
        <ReskitLogo :size="40" />
        <v-toolbar-title
          class="text-primary font-weight-black letter-spacing-1 ml-2"
        >
          RES<span class="text-text">KIT</span>
          <span class="text-overline">V2.0</span>
        </v-toolbar-title>
      </div>

      <v-spacer />

      <v-text-field
        v-model="urlInput"
        density="compact"
        variant="solo-filled"
        flat
        bg-color="surface-variant"
        placeholder="Enter URL..."
        hide-details
        class="url-bar-refined mx-2"
        @keyup.enter="handleUpdate"
      >
        <template #prepend-inner>
          <v-icon size="small" color="primary">mdi-link-variant</v-icon>
        </template>
        <template #append-inner>
          <v-fade-transition>
            <v-icon
              v-if="urlInput"
              size="x-small"
              color="grey"
              class="cursor-pointer"
              @click="urlInput = ''"
              >mdi-close-circle</v-icon
            >
          </v-fade-transition>
        </template>
      </v-text-field>

      <v-btn
        color="primary"
        variant="flat"
        class="ml-2 px-6"
        height="40"
        @click="handleUpdate"
      >
        <v-icon start size="small">mdi-refresh</v-icon>
        Update
      </v-btn>

      <v-spacer />

      <div class="d-flex align-center mr-4">
        <TooltipButton
          variant="tonal"
          color="secondary"
          icon="mdi-cellphone"
          text="Test on your mobile"
          @click="dialog = true"
        />

        <TooltipButton
          class="ml-2"
          variant="tonal"
          color="primary"
          :icon="
            isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'
          "
          :text="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          @click="toggleTheme"
        />
      </div>
    </v-app-bar>

    <v-main class="bg-darkness">
      <v-container fluid class="fill-height py-0">
        <v-row no-gutters class="fill-height">
          <v-col
            v-for="config in deviceConfigs"
            :key="config.id"
            cols="12"
            :lg="config.lg"
            :xl="config.xl"
            class="pa-2"
          >
            <DeviceViewport
              v-model:device="config.activeDevice"
              v-model:zoom="config.zoom"
              v-model:rotate="config.rotate"
              :items="config.items"
              :src="activeSrc"
              :max-height="computedMaxHeight"
              :frameNo="config.id"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <QrDialog :url="activeSrc" v-model="dialog" :isDark="isDark" />
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useDisplay } from "vuetify";
import { laptops, televisions, phones, tablets } from "~/assets/devices.json";

// Composable & State
const { isDark, toggleTheme } = useMyTheme();
const display = useDisplay();
const isHydrated = ref(false);

const urlInput = ref("https://nuxtjs.org/");
const activeSrc = ref("https://nuxtjs.org/");
const dialog = ref(false);

onMounted(() => {
  isHydrated.value = true;
});

// Device Setup
const lgSet = [...laptops, ...televisions];
const smSet = [...phones, ...tablets];

const deviceConfigs = ref([
  {
    id: 1,
    xl: 7,
    lg: 8,
    zoom: 0,
    rotate: false,
    items: lgSet,
    activeDevice: lgSet[3],
  },
  {
    id: 2,
    xl: 5,
    lg: 4,
    zoom: 0,
    rotate: false,
    items: smSet,
    activeDevice: smSet[6],
  },
]);

// Helpers
const handleUpdate = () => {
  let target = urlInput.value.trim();
  if (!target) return;
  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
    urlInput.value = target;
  }
  activeSrc.value = target;
};

const computedMaxHeight = computed(() => {
  if (!isHydrated.value) return "86vh";
  const map = { xs: "86vh", sm: "86vh", md: "600px", lg: "86vh", xl: "90vh" };
  return map[display.name.value] || "86vh";
});
</script>

<style scoped lang="scss">
.url-bar-refined {
  max-width: 500px;
  :deep(.v-field) {
    border-radius: 8px !important;
    font-size: 0.9rem;
    border: 1px solid rgba(var(--v-theme-primary), 0.4) !important;
  }

  :deep(.v-field__input) {
    color: rgb(var(--v-theme-text)) !important;
    opacity: 1 !important;
  }
}

:deep(.v-btn__content) {
  color: white;
}
</style>
