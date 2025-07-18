<template>
    <div class="corePart-container">
        <div :class="isMobilePhone?'mbHearder':'hearder'" ref="headerRef">
            <QuestionCover />
        </div>
        <div class="middle">
            <QuestionShow></QuestionShow>
        </div>
        <div class="floor"></div>
    </div>
</template>

<script setup lang='ts'>

import { useScreenSize } from '@/hooks/useScreenSize';
import { onMounted,ref } from 'vue';
const { isMobilePhone }  = useScreenSize();
const headerRef = ref<HTMLElement|null>(null)

onMounted(()=>{
    
})

</script>

<style lang="scss" scoped>

.corePart-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 2% 0%;
    overflow: hidden;
    gap: 10%;
    position: relative;

    .hearder {
        width: 80%;
        height: 22vh;
        display: flex;
        min-width: 420px;
        max-width: 1000px;
      
    }
    .mbHearder{
        width: 100%;
        height: 100%;
       
    }
    .middle{
        width: 50%;
        height: 40vh;
        // background-color: black;
    }
}
</style>