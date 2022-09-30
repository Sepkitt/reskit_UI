<template>
      <v-row align="center" justify="center">
        <v-col cols="3" class="d-flex justify-center">
          <v-img width="150px" src="/Reskit_Logo.svg" lazy-src="/Reskit_Logo.svg">

            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5">
                </v-progress-circular>
              </v-row>
            </template>
          </v-img>

        </v-col>

        <v-col cols="12">
          <h1 class="subtitle white--text font-weight-thin text-center">
            Simulate devices in an array of diferent sizes
          </h1>
        </v-col>
        <v-btn class="button pa-6 mt-5 primary--text" dark to="UI" color="background">
          navigate to UI


          <CoreChevron class="d-flex align-center justify-center hover mx-5" size="40px" rotate="90" variant="path"
            strokeWidth="6" flip="y" />
          <!-- <v-row justify="center" class="hover">
             
             </v-row> -->

        </v-btn>
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
</style>