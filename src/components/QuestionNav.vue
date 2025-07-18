<template>
    <div class="Chapter-container">
        <div class="subtitle" style="font-size: 15px;font-weight: bold;">{{ props.chapter.name }}</div>
        <div class="question" v-for="(item, key) in props.chapter.content" :key="key">
            <div style="font-size: 12px;font-weight: bold;">{{ key == "Achoice" ? '单选' : '多选' }}</div>
            <ul class="question-list">
                <li v-for="question in item" :class="{
                    active:props.locate == question.questionNum,
                    correct:question.chooseRight,
                    incorrect: !question.chooseRight&&question.userAnswer
                    }" 
                    @click="chooseQuestion(question)"
                    :key="question.id">{{ question.questionNum.split("-")[2] }}</li>
            </ul>

        </div>
    </div>
</template>

<script setup lang='ts'>
import { defineEmits } from 'vue'

interface Chapter {
    name: string,
    content: Content


}
interface Content {
    Achoice: QuestionInfo[],
    ManyChoice: QuestionInfo[]
}
interface QuestionInfo {
    "id": string,
    "questionNum": string,
    "question": string,
    "select":
    {
        "A": string,
        "B": string
    },
    "answer": string,
    "type": string,
    "chooseRight": boolean,
    "userAnswer": string
}

const props = withDefaults(defineProps<{
    chapter: Chapter,
    locate:string

}>(), {
    chapter: () => {
        return {
            name: "daolun",
            content: {
                Achoice: [
                    {
                        "id": "dqxxx",
                        "questionNum": "1-1-1",
                        "question": "1、狭义的马克思主义是指：（  ）",
                        "select":
                        {
                            "A": "马克思恩格斯创立的基本理论基本观点和学说的体系",
                            "B": "列宁主义",
                            "C":"xxx",
                            "D":"yyy"
                        },
                        "answer": "A",
                        "type": "单选",
                        "chooseRight": false,
                        "userAnswer": "C"
                    },
                ],
                ManyChoice: [
                    {
                        "id": "dqxxx",
                        "questionNum": "1-2-1",
                        "question": "1、狭义的马克思主义是指：（  ）",
                        "select":
                        {
                            "A": "马克思恩格斯创立的基本理论基本观点和学说的体系",
                            "B": "列宁主义",
                            "C":"xxx",
                            "D":"yyy"
                        },
                        "answer": "AB",
                        "type": "多选",
                        "chooseRight": false,
                        "userAnswer": ""

                    },
                ]
            }
        }
    },
    locate:"1-1-1"
})



const emits = defineEmits(["update:modelValue"]);

function chooseQuestion(question:QuestionInfo){
    console.log(question)
    emits("update:modelValue",question)
}

</script>

<style lang="scss" scoped>
.Chapter-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    .question-list {
        list-style: none;
    }

    .question-list li {
        display: flex;
        width: 28px;
        height: 28px;
        color: #636363;
        justify-content: center;
        align-items: center;
        text-align: center;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 50%;
        margin: 5px;
        cursor: pointer;
    }

    .question-list li.correct {
        background-color: #28a745;
        color: #fff;
        border-color: #28a745;
    }

    .question-list li.incorrect {
        background-color: #dc3545;
        color: #fff;
        border-color: #dc3545;
    }

    .question-list li.active {
        background-color: #4a90e2;

        border-color: #4a90e2;
        color: #fff;
    }

    .question-list li:hover {
        background-color: #e0e0e0;
    }


}
</style>