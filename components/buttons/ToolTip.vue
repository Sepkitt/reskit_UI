<template>
  <v-tooltip bottom color="background" class="shadow">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot name="content" />
      </div>
    </template>
    <span>{{title}}</span>
  </v-tooltip>

</template>

<script setup lang="ts">
interface PROPS {
  title: string;
}
const props = defineProps<PROPS>();
</script>

<style lang="scss" scoped>

</style>