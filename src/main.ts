

import { createApp } from "vue";
import App from './App.vue';
import { router } from "./router"; 
import ElementPlus from "element-plus";
import 'element-plus/dist/index.css';
import "@/styles/global.css";
import { pinia } from "./stores";

function setRem() {
    const baseWidth = 375; // 设计稿宽度
    const baseFontSize = 4; // 基础字体大小（px）
    const screenWidth = window.innerWidth; // 获取当前屏幕宽度
    
    // 计算新的 rem 值
    const rem = (screenWidth / baseWidth) * baseFontSize;
    document.documentElement.style.fontSize = rem + 'px'; // 设置根元素的字体大小
}

// 初次设置
window.addEventListener("resize",setRem);

const app = createApp(App);
app.use(ElementPlus);
app.use(pinia);
app.use(router);
app.mount('#app');

