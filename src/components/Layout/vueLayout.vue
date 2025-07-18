<template>
    <div class="Layout-container">
        <div class="Layout-hearder">
            <vueHearder></vueHearder>
        </div>
        <div class="Layout-center">
            <div class="intro">
                <h1 style="color: #3451b2;">DocToQuiz</h1>
                <h1>一个将pdf题库转化为在线做题的网站，帮助你更高效的复习！</h1>
                <p style="font-size: clamp(18px,1.4rem,24px);color: #3C3C43C7;">A website that converts PDF question banks into online questions to help you revise more efficiently!</p>
                <button type="button" class="start" @click="goStart">开始使用</button>
            </div>
            <div class="content">
                <ExampleCom style="width: 220px;height: 120px;"></ExampleCom>
            </div>
        </div>

    </div>
</template>

<script setup lang='ts'>

import { useRouter } from 'vue-router';

const router= useRouter();

const goStart = ()=>{
    router.push({
        name:"start",
        params:{
            function:"start"
        }
    })
}


</script>

<style lang="scss" scoped>

.Layout-container{
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.Layout-center{
    max-width: 1200px;
    width: 88%;
    display: flex;
    flex-direction: column;

    gap: 20px;
    .intro{
        font-size: clamp(24px,2.6rem,52px);
        display: flex;
        flex-direction: column;
        max-width: 576px;
        gap: 10px;
        h1{
            font-size: inherit;
        }
        .start{
            margin-top: 30px;
            width: 96px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            background-color: #5672cd;
            border: none;
            border-radius: 20px;
        }
    }
    .content{
        margin-top: 20px;
    }
    
}
.Layout-hearder{
    width: 100%;
}

</style>