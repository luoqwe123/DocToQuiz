
import { ref, onMounted, onUnmounted, } from "vue";

export function useScreenSize() {
    const isMobilePhone = ref<boolean>(false);
    const screenWidth = ref(window.innerWidth);
    const screenHeight = ref(window.innerHeight);

    function checkScreen() {
        screenWidth.value = window.innerWidth;  
        screenHeight.value = window.innerHeight;
        isMobilePhone.value = screenWidth.value <= 768;
    }

    onMounted(() => {
        window.addEventListener('resize', checkScreen);
    })
    onUnmounted(()=>{
        window.removeEventListener("resize",checkScreen);
    })
    return {
        isMobilePhone,
        screenHeight,
        screenWidth
    }
}