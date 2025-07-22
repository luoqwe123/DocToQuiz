<template>
    <div class="App-container">
        <div class="a" ></div>
        <RouterView v-if="false"></RouterView>
    </div>
</template>

<script setup lang='ts'>
import { RouterView } from 'vue-router';


</script>

<style scoped lang="scss">

.App-container{
    width: 100%;
    height: 100vh;
}

</style>