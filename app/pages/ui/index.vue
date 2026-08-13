<template>
  <v-app>
    <v-app-bar :color="!isDark ? 'background' : 'surface'">
      <v-toolbar-title
        class="d-flex fill-height align-center text-primary font-weight-bold text-title-large"
      >
        <div class="d-flex fill-height">
          Res<span class="text-text">KIT</span>
          <span
            class="d-flex align-center pa-1 text-label-small font-weight-bold ml-2 tooltip-primary"
            >V{{ $config.public.clientVersion }}</span
          >
        </div>
      </v-toolbar-title>

      <v-spacer />

      <v-text-field
        v-model="urlInput"
        density="compact"
        variant="solo"
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
              >mdi-close</v-icon
            >
          </v-fade-transition>
        </template>
      </v-text-field>

      <v-btn
        color="primary"
        variant="flat"
        class="ml-2"
        height="40"
        @click="handleUpdate"
      >
        <v-icon start size="small">mdi-refresh</v-icon>
        Update
      </v-btn>

      <v-spacer />
      <!-- <v-btn
        icon="mdi-content-copy"
        :color="mirrorEnabled ? 'success' : undefined"
        @click="mirrorEnabled = !mirrorEnabled"
      /> -->
      <div class="d-flex align-center mr-4">
        <TooltipButton
          variant="tonal"
          color="secondary"
          icon="mdi-cellphone"
          text="Test on your mobile"
          @click="dialog = true"
        />

        <TooltipButton
          class="ml-1"
          variant="tonal"
          color="primary"
          :icon="
            isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'
          "
          :text="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          @click="toggleTheme"
        />
        <BtnMenu class="ml-1">
          <template #content>
            <div class="text-title-small text-grey py-1">Hide frame</div>
            <v-switch
              v-model="config.visible"
              v-for="config in deviceConfigs"
              :key="config.id"
              :label="`Frame ${config.id}`"
              inset="square"
              true-icon="mdi-check"
              false-icon="mdi-close"
              density="comfortable"
              :disabled="visibleDeviceConfigs.length === 1 && config.visible"
              thumb-color="success"
              hide-details
            ></v-switch>
          </template>
        </BtnMenu>
      </div>
    </v-app-bar>

    <v-main class="bg-darkness">
      <v-container fluid class="fill-height py-0 px-0">
        <v-row no-gutters class="fill-height" density="compact">
          <v-col
            v-for="config in visibleDeviceConfigs"
            :key="config.id"
            cols="12"
            :lg="isSingleFrame ? 12 : config.lg"
            :xl="isSingleFrame ? 12 : config.xl"
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
              @navigate="syncNavigation(config.id, $event)"
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

const mirrorEnabled = ref(false);
const masterFrame = ref(1);
const syncing = ref(false);

const syncNavigation = (sourceFrameId, url) => {
  if (!mirrorEnabled.value) return;

  if (sourceFrameId !== masterFrame.value) return;

  if (syncing.value) return;

  if (activeSrc.value === url) return;

  syncing.value = true;
  console.log("Mirror event", {
    sourceFrameId,
    url,
    mirrorEnabled: mirrorEnabled.value,
    masterFrame: masterFrame.value,
  });
  console.log("Syncing follower:", url);
  
  activeSrc.value = url;

  requestAnimationFrame(() => {
    syncing.value = false;
  });
};
// Composable & State
const { isDark, toggleTheme } = useMyTheme();
const display = useDisplay();
const isHydrated = ref(false);

const urlInput = ref("http://localhost:3000/demo");
const activeSrc = ref("http://localhost:3000/demo");
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
    visible: true,
    xl: 7,
    lg: 8,
    zoom: 0,
    rotate: false,
    items: lgSet,
    activeDevice: lgSet[3],
  },
  {
    id: 2,
    visible: true,
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

const visibleDeviceConfigs = computed(() =>
  deviceConfigs.value.filter((config) => config.visible),
);

const isSingleFrame = computed(() => visibleDeviceConfigs.value.length === 1);
</script>

<style scoped lang="scss">
.url-bar-refined {
  max-width: 500px;
  :deep(.v-field) {
    border-radius: 5px !important;
    font-size: 0.9rem;
    border: 1px solid rgba(var(--v-theme-primary), 0.4) !important;
    box-shadow: inset 0 2px 6px 0 rgb(var(--v-theme-background));
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
