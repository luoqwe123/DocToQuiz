<template>
    <div class="Control-container">
        <button type="button" class="saveNote" @click="emits('saveNote')">保存做题记录</button>
        <button type="button" class="cleanNote" @click="emits('cleanNote')">清除做题记录</button>
        <button type="button" class="convert" v-if="isMobilePhone" @click="showConvert">转化</button>
        <button type="button" class="questionList" v-if="isMobilePhone" @click="showQueList">题列表</button>
        <button type="button" class="note" @click="emits('showErrorBook')">错题本</button>
        <button type="button" class="homePage" @click="goHome">首页</button>
    </div>
</template>

<script setup lang='ts'>
import { useScreenSize } from '@/hooks/useScreenSize';
import { useRouter } from 'vue-router';

const router = useRouter();

const { isMobilePhone } = useScreenSize();

const emits = defineEmits(["showConvert","showQueList","saveNote","cleanNote","showErrorBook"])

function goHome() {
    router.push({ path: "/" });
}




function showConvert() {
    emits("showConvert",)
}
function showQueList(){
    emits("showQueList")
}

</script>

<style lang="scss" scoped>
.Control-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    gap: 2%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    padding: 0 1%;

    button {
        height: 48%;
        min-height: 42px;
        // background-color: #4a90e2;
        flex: 1;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    /* 第1个按钮：保存做题记录（蓝色系） */
    .saveNote {
        background-color: #0d6efd;
    }

    .saveNote:hover {
        background-color: #0a58ca;
        /* 加深蓝色 */
    }

    /* 第2个按钮：清除做题记录（红色系） */
    .cleanNote {
        background-color: #dc3545;
    }

    .cleanNote:hover {
        background-color: #bb2d3b;
        /* 加深红色 */
    }

    /* 第3个按钮：转化（绿色系） */
    .convert {
        background-color: #198754;
    }

    .convert:hover {
        background-color: #157347;
        /* 加深绿色 */
    }

    .questionList {
        background-color: #3dd67d;
    }

    .questionList:hover {
        background-color: #2fc26d;
        /* 加深绿色 */
    }

    /* 第4个按钮：错题本（橙色系） */
    .note {
        background-color: #fd7e14;
    }

    .note:hover {
        background-color: #e67700;
        /* 加深橙色 */
    }

    /* 第5个按钮：首页（靛蓝色系） */
    .homePage {
        background-color: #17a2b8;
    }

    .homePage:hover {
        background-color: #138496;
        /* 加深靛蓝色 */
    }
}
</style>