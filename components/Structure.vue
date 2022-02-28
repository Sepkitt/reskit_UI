<template>
  <v-container class="mt-5" fluid >
    <v-row justify="center">
      <v-col cols="12" md="12" xl="11">
        <slot name="content" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>

<style >
.structure--offset {
  top: -11rem;
  position: relative;
}
</style>
