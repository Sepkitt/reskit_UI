<template>
    <div>
       <v-container fill-height >
         <v-row align="center"
         >
        <v-col cols="12">
            <div class="white--text display-4">Reskit</div>
        </v-col>
       <v-col cols="12">
          <div class="subtitle white--text display-1">
            Simulate devices in an array of diferent sizes
        </div>
       </v-col>
        <v-btn class="button pr-5 primary--text" x-large dark to="UI" color="background" width="280px" height="86px">
            navigate to UI


              <CoreChevron class="d-flex align-center justify-center hover mx-5" size="40px" rotate="90" variant="path" strokeWidth="6" flip="y" />
             <!-- <v-row justify="center" class="hover">
             
             </v-row> -->
           
        </v-btn>
       </v-row>
       </v-container>
    </div>
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
  animation:move 4s infinite
}
@keyframes move {
    0% { left: 0;}
    50%{ left : 40px;}
    100%{ left: 0;}
}

</style>