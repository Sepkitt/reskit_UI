<template>
  <div id="wrapper" :style="`transform:{};`">
      <v-sheet elevation="10" class="device" color="red" :height="height" :width="width" >
        <iframe id="frame_1" class="holds-the-iframe"  :src="src" />
      
      </v-sheet>

  </div>
</template>

<script setup lang="ts">
const props = defineProps({
   activeDevice: { type: Object },
    height: {
      required: false,
      default:480
    },
    width: {
      required: false,
      default:740

    },
    screen: { type: String },
    src: {
      type: String,
      default: 'https://nuxtjs.org/',
    },
    deviceType: {
      type: String,
    },
    types: {
      type: Array,
    },
})

</script>

<style scoped>

</style>