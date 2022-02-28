<template>
  <v-tooltip bottom color="background" class="shadow">
    <template v-slot:activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
      >
        <slot name="content" />
      </div>
    </template>
    <span>{{title}}</span>
  </v-tooltip>

</template>

<script>
export default {
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>

</style>