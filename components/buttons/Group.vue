<template>
  <div>

    <v-btn-toggle
      v-model="inputVal"
    >
      <v-btn
        v-bind="$attrs"
        v-on="{
            ...$listeners
          }"
      >
        <slot name="content" />

      </v-btn>

    </v-btn-toggle>
  </div>
</template>

<script>
export default {
  name: 'button-group',
  inheritAttrs: false,
  props: {
    value: {
      type: String
    }
  },
  computed: {
    inputVal: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit("input", val)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
</style>