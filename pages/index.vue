<template>
  <v-row align="center">


    <v-col cols="12" md="6" order-sm=12>
      <v-row>
        <v-col cols="12" :class="{'text-center mt-3': $vuetify.breakpoint.smAndDown}">
          <h1 class="white--text">Reskit <span class="primary--text">UI</span></h1>
          <h2 class="subtitle text--text font-weight-thin ">
            Simulate devices in an array of diferent sizes
          </h2>
        </v-col>
        <v-col :class="{'text-center': $vuetify.breakpoint.smAndDown}">
          <v-btn class="pa-6" dark to="UI" color="darkness">
            navigate to <span class="ml-2 primary--text">UI</span></v-btn>

        </v-col>
      </v-row>
    </v-col>
    <v-col cols="3" class="mx-auto d-flex justify-end" order-sm=1>
      <v-img width="150px" src="/Reskit_Logo.svg" lazy-src="/Reskit_Logo.svg">

        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-5">
            </v-progress-circular>
          </v-row>
        </template>
      </v-img>

    </v-col>

  </v-row>
</template>

<script>
export default {
  layout: 'home'
}
</script>

<style lang="scss" scoped>
.button {
  box-shadow: inset 4px 4px 11px rgba(0, 0, 0, 38%);
}

.hover {
  position: relative;
  animation: move 4s infinite
}

@keyframes move {
  0% {
    left: 0;
  }

  50% {
    left: 40px;
  }

  100% {
    left: 0;
  }
}

a {
  text-decoration: none;
}
</style>