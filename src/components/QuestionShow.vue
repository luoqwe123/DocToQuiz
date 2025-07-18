<template>
    <div class="QuestionsShow-container">
        <div class="question">{{ props.question }}</div>
        <div class="options">
            <label v-for="(item, key) in props.select" :class="{
                correct: (showAnswer||props.userAnswer) && key == props.answer,
                disabled: showAnswer,
                incorrect: (showAnswer && c_userAnswer != props.answer && c_userAnswer == key)||key == props.userAnswer

            }" :key="key" >
                <input type="radio" :value="key" @change="judg($event)" :disabled="showAnswer">
                {{ key+'.'+ item }}
            </label>

        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, defineEmits } from 'vue';

interface Option {
    "A": string,
    "B": string,
    "C": string,
    "D": string,
}

const props = withDefaults(defineProps<{
    question: string;
    select: Option;
    answer: string,
    userAnswer:string,
    chooseRight:boolean
}>(), {
    question: "1+1等于多少",
    select:()=>{ return {
        "A": "马克思恩格斯创立的基本理论基本观点和学说的体系",
        "B": "列宁主义",
        "C": "xxx",
        "D": "yyy"
    }},
    answer: "B",
    userAnswer:"C",
    chooseRight:false
});

const $emits = defineEmits(["update:modelValue"]);

const showAnswer = ref<boolean>(false);
const c_userAnswer = ref<string>("")

const judg = (event: Event) => {
    const target = event.target as HTMLInputElement;
    showAnswer.value = true;
    c_userAnswer.value = target.value;
    $emits("update:modelValue", c_userAnswer.value);

}

</script>

<style lang="scss" scoped>
.QuestionsShow-container {
    width: 100%;
   
    
   
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* min-width: 600px; */
    min-width: 420px;
    height: 100%;
    gap: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .question {
        font-size: 18px;
    }
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