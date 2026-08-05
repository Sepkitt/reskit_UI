<template>
  <v-btn
    icon
    color="primary"
    class="tooltip-success"
    variant="tonal"
    size="small"
  >
    <v-icon :icon="'mdi-dots-vertical'" color="success" />
    <v-menu activator="parent">
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" :value="index">
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>

          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
        <v-divider v-if="$slots.content"></v-divider>
        <v-list-item class="bg-background" v-if="$slots.content">
          <slot name="content" />
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
const props = defineProps({
  items: [],
});
</script>

<style scoped></style>
