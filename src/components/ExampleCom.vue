<template>
    <div class="ExampleCom-container">
        <div class="example-icon">
            <slot name="icon">

            </slot>
        </div>
        <div class="title" style="font-weight: bold;font-size: 16px;">{{ props.title }}</div>
        <div class="description" style="font-size: 14px;">{{ props.description }}</div>
    </div>
</template>

<script setup lang='ts'>


const props = withDefaults(defineProps<{
    title:string,
    description:string
}>(),{
    title:"大二下 - 毛概",
    description:"这个是25年计院毛概的题库"
});


</script>

<style lang="scss" scoped>

.ExampleCom-container{

    background-color: #f6f6f7;
    width: 100%;
    height: 100%;
    display: flex;
    box-sizing: border-box; /* 关键设置 */
    flex-direction: column;
    padding: 2%;
    gap: 5px;
}

</style>