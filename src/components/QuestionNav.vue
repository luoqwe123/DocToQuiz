<template>
    <div class="QueNav-container">
        <div :class="isMobilePhone ? 'mbMask' : 'mask'" @click="closeList"></div>
        <div :class="{ 'box': true, 'mbBox': isMobilePhone,'pcBox':!isMobilePhone }">
            <div style="font-size: 18px;font-weight: bold;margin-bottom: 8px;">题目导航</div>
            <QuestionChapter v-for="(item, key) in props.data" :key="key" class="questionNav" :chapter="item"
                :locate="currentQuestion.questionNum" style="height: auto;" />
        </div>
    </div>
</template>

<script setup lang='ts'>

import { useScreenSize } from '@/hooks/useScreenSize';
import  type { ViewInfo as QuestionInfo,Chapter} from '@/types/forQuestion';



const props = withDefaults(defineProps<{
    data: Chapter[],
    currentQuestion: QuestionInfo
}>(), {

})

const emits = defineEmits(["changeQuelistStatus"])


function closeList() {
    emits("changeQuelistStatus", false);
}

const {isMobilePhone} = useScreenSize();


</script>

<style lang="scss" scoped>
.QueNav-container {
    width: 100%;
    height: 100%;


    .mask {
        width: 0px;
        height: 0px;
    }

    .mbMask {
        width: 100%;
        height: 120%;
        background-color: black;
        opacity: .6;
        position: absolute;
        top: -2%;
        z-index: 2;

    }
}

.box {
    background-color: #fff;
    box-sizing: border-box;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow-y: scroll;
    //overflow-y: auto;
    width: 100%;
}

.pcBox {

    min-width: 240px;
    height: 100%;
    border-radius: 8px;
}

.mbBox {
    height: 75%;
    position: absolute;
    top: 25%;
    z-index: 3;
    border-radius: 0px;
    animation: move .4s ease-in;
}

@keyframes move {
    0% {
        top: 100%;
    }

    100% {
        top: 25%;
    }
}
</style>