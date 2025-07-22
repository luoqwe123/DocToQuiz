<template>
    <div class="Convert-container" >
        <div :class="isMobilePhone?'mbMask':'mask'" @click="closeConvert"></div>
        <div :class="{'box':true, 'mbBox':isMobilePhone}">
            <h1>Upload a Document</h1>
            <div :class="{'inputRegion':true,'pc-inputRegion':!isMobilePhone,'mb-inputRegion':isMobilePhone}">
                <input type="file" class="fileInput" ref="fileInputRef" accept=".pdf" required>
                <button type="button" class="selectBtn" @click="selectPdf">选择文件</button>
                <div style="font-size: 12px;text-align: center;">{{targetFile.info?targetFile.info.name:'未选择任何文件'}}</div>
            </div>

            <button type="button" :class="{'convertButton':true,'pc-convertButton':!isMobilePhone,'mb-convertButton':isMobilePhone}" @click="convert">Convert</button>
        </div>

    </div>
</template>

<script setup lang='ts'>

import { onMounted, ref, } from 'vue';
import { useScreenSize } from '@/hooks/useScreenSize';
import { upload } from '@/utils/requestJson';

const { isMobilePhone } = useScreenSize();
// import   pdf   from "pdf-parse";
// import fs from "fs";

interface targetFile{
    info:File|null,
    path:string
}
const emits = defineEmits(["changeConvertStatus"])

const fileInputRef = ref<HTMLInputElement|null>(null);
const targetFile = ref<targetFile>({info:null,path:""});


const closeConvert = ()=>{
    emits("changeConvertStatus",false);
}

function selectPdf(){
    if(fileInputRef.value){
        fileInputRef.value.click();
    }
}
function checkFile(event:Event){
    targetFile.value!.info = (event.target as HTMLInputElement).files![0];
}

async function convert(){
    if(targetFile.value){
        console.log(targetFile.value)
        const res = await upload(targetFile.value.info!);
        console.log(res.data)
        // const dataBuffer =  fs.readFileSync(targetFile.value.path);
        // const strs = await pdf(dataBuffer as Buffer);
        // console.log(strs)
    }
}
onMounted(()=>{
    if(fileInputRef.value){
        fileInputRef.value.addEventListener("change",checkFile);
    }
    
})


</script>

<style lang="scss" scoped>
.Convert-container {
    width: 100%;
    height: 100%;
    // position: relative;
    
    .mask{
        width: 0px;
        height: 0px;
    }
    .mbMask{
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
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    padding: 2% 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 12px;
}
.mbBox{
    height: 75% !important;
    position: absolute;
    top: 25%;
    z-index: 3;
    border-radius:0px !important;
    animation: move .4s ease-in;
}
@keyframes move {
    0%{
        top: 100%;
    }
    100%{
        top: 25%;
    }
}

/* 标题样式 */
h1 {
    font-size: 28px;
    font-weight: 600;
    color: #1a1a1a;

}

.mb-inputRegion{
    width: 88%;
    height: 40%;
}
.pc-inputRegion{
    width: 56%;
    height: 42%;
}

/* 文件输入框样式 */
.inputRegion {
   
    border: 2px dashed var(--el-border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    gap: 20px;
    .selectBtn{
        height: 64%;
        width: 200px;
        background-color: #0057ff;
        border: none;
        color: white;
        border-radius: 5px;
        cursor: pointer;

    }
}
.fileInput{
    display: none !important;
}

.mb-convertButton{
    width: 50%;
    height: 16%;
}
.pc-convertButton{
    min-width: 78px;
    min-height: 45px;
    width: 20%;
    height: 25%;
}

/* 转换按钮样式 */
.convertButton {
    background-color: #67c23a;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    vertical-align: center;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
   
}

/* 按钮悬停和点击效果 */
.convertButton:hover {
    // background-color: #357abd;
    transform: translateY(-1px);
}

.convertButton:active {
    transform: translateY(0);
}

/* 禁用按钮样式 */
.convertButton:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>