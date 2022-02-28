<template>
  <div class="text-center">
    <v-dialog
      v-model="inputVal"
      persistent
      :max-width="maxWidth"
    >

      <v-card
        color="infoBg"
        ref="popup"
        tile
        class="pa-5"
      >

        <div class="mt-3 white--text">
          <slot name="content"></slot>

        </div>

        <v-divider />
      </v-card>

      <v-footer color="darkness">

        <v-spacer />

        <v-btn
        
          class="mr-3"
          v-if="showDefaultClose"
          color="primary"
          text
          @click.stop="inputVal=false"
        >
          {{closeBTNName}}
        </v-btn>
        <slot name="actions" />
        <v-spacer />

      </v-footer>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'popup',
  props: {
    value: Boolean,
    header: String,
    title: String,
    buttonName: String,
    maxWidth: {
      type: String,
      default: "500px"
    },
    closeBTNName: {
      type: String,
      default: "Close"
    },
    showDefaultClose: {
      type: Boolean,
      default: true
    },

  },

  computed: {
    inputVal: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },


}
</script>
