<script setup lang="ts">
const props = defineProps<{ url: String }>();

</script>

<template>
    <v-row justitfy="center">
        <v-col cols="12">
            <div class="text-h6 text-center font-weight-thin">Test on mobile device</div>

        </v-col>
        <v-col cols="12" class="d-flex justify-center ">
            <vue-qr colorLight="#1D2E4B" colorDark="#f2f2f2" autoColor backgroundColor="#1D2E4B" :text="url"
                qid="testid">
            </vue-qr>
        </v-col>

    </v-row>


</template>