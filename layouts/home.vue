<template>
  <v-app id="app">
    <v-card
      flat
      dense
      color="transparent"
    >

      <v-app-bar
        flat
        color="transparent"
      >

        <v-col cols="10">
          <v-img
            width="30px"
            src="/sepstacks-logo.svg"
            lazy-src="/sepstacks-logo.svg"
          >

            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                >
                </v-progress-circular>
              </v-row>
            </template>
          </v-img>

        </v-col>

        <v-spacer></v-spacer>

        <v-btn dark text >
            <a class="white--text" href="https://github.com/Sepkitt/reskit_UI">
          <v-icon class="mx-2" color="white" >la-github</v-icon>
        
            Github
          </a>
         
        </v-btn>
      </v-app-bar>

    </v-card>
   <v-main>
     <v-container fill-height>
       <v-row>
         <v-col>
            <nuxt />
         </v-col>
       </v-row>
     </v-container>
   </v-main>
  </v-app>
</template>

<style scoped>

  .theme--light.v-application {
     background-image: url('../static/background.svg') !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: 50% 50% !important;
}

a {
  text-decoration: none;
}

</style>