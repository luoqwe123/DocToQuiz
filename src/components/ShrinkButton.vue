<template>
    <div class="ShrinkButton-container">
    
        <button type="button" class="shrink-button">
            <div class="sbtn-container" >
                <span class=" top-part" :style="{backgroundColor:props.backColor}"></span>
                <span class=" middle-part" :style="{backgroundColor:props.backColor}"></span>
                <span class=" bottom-part" :style="{backgroundColor:props.backColor}"></span>
            </div>
            
        </button>
    </div>
</template>

<script setup lang='ts'>

const props = withDefaults(defineProps<{
    backColor:string
}>(),{
    backColor:"#3c3c43"
})

</script>

<style lang="scss" scoped>

.ShrinkButton-container{
    border: none;
    width: 100%;
    height: 100%;
    display: flex;
   .shrink-button{
        border: inherit;
        width: 100%;
        height: 100%;
        display: flex;
        background-color: white;
       
        .sbtn-container{
            width: 100%;
            height: 100%;
          
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            overflow: hidden;
            .top-part{
                width: 100%;
                height: 2px;
                transform: translateX(0%);
            }
            .middle-part{
                width: 100%;
                height: 2px;
                transform: translateX(50%);
            }
            .bottom-part{
                width: 100%;
                height: 2px;
                transform: translateX(25%);
            }
        }
    }
}


</style>