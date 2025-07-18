<template>
    <div class="QuestionsShow-container">
        <div class="question"></div>
        <div class="options">
            <label v-for="(item, key) in options" :key="key">
                <input type="radio" :option="item.answer" @click="judg(item.answer)">
                {{ item.select }}
            </label>

        </div>
    </div>
</template>

<script setup lang='ts'>
// import { ref } from 'vue';

let options = [
    {
        answer: "A",
        select: "A.xxx"
    },
    {
        answer: "B",
        select: "B.xxx"
    }
]

const judg = (option: string) => {
    console.log(option)
}

</script>

<style lang="scss" scoped>
.QuestionsShow-container{
    width: 100%;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* min-width: 600px; */
    min-width: 420px;
    height: 100%;
}

.options {
    label {
        display: block;
        margin: 10px 0;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    input[type="radio"] {
        display: none;
    }

    label:hover {
        background-color: #f0f0f0;
    }

}
</style>