
<script setup lang="ts">

interface Props {
  value: boolean;
  title?: string;
  maxWidth: string;
  closeBTNName: string;
  showDefaultClose?: boolean
}
// props with default values
const props = withDefaults(defineProps<Props>(), {
  maxWidth: '500px',
  closeBTNName: 'Close',
  showDefaultClose: true
});

const emit = defineEmits(['input'])

const inputVal = computed({
  get: () => props.value,
  set: (value) => emit('input', value)
})

</script>

<template>
  <div class="text-center">
    <v-dialog v-model="inputVal" persistent :max-width="maxWidth">

      <v-card color="infoBg" ref="popup" tile class="pa-5">

        <div class="mt-3 white--text">
          <slot name="content"></slot>

        </div>

        <v-divider />
      </v-card>

      <v-footer color="darkness">

        <v-spacer />

        <v-btn class="mr-3" v-if="showDefaultClose" color="primary" text @click.stop="inputVal=false">
          {{closeBTNName}}
        </v-btn>
        <slot name="actions" />
        <v-spacer />

      </v-footer>
    </v-dialog>
  </div>
</template>

