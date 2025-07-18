<template>
    <div class="corePart-container">
        <div :class="isMobilePhone ? 'mbHearder' : 'hearder'" ref="headerRef">
            <QuestionCover />
        </div>
        <div class="middle">
            <div class="questionPart">
                <QuestionShow class="questionShow" v-model="userAnswer" :question="currentQuestion.question"
                    :select="currentQuestion.select" :answer="currentQuestion.answer"
                    :userAnswer="currentQuestion.userAnswer" :chooseRight="currentQuestion.chooseRight"></QuestionShow>
                <div class="switchBtn">
                    <button type="button" class="prev-btn" @click="prevQuestion">&lt;</button>
                    <button type="button" class="next-btn" @click="nextQuestion">&gt;</button>
                </div>
            </div>

            <div class="navPart">
                <div style="font-size: 18px;font-weight: bold;margin-bottom: 8px;">题目导航</div>
                <QuestionNav class="questionNav" :chapter="chapter" :locate="currentQuestion.questionNum"
                    v-model="currentQuestion" />
            </div>
        </div>
        <div class="floor">
            <QuestionControl />
        </div>
    </div>

</template>

<script setup lang='ts'>

import { useScreenSize } from '@/hooks/useScreenSize';
import { onMounted, ref, watchEffect } from 'vue';
const { isMobilePhone } = useScreenSize();
const headerRef = ref<HTMLElement | null>(null)

let data = [{
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
                    "C": "xxx",
                    "D": "yyy"
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
                    "A": "马克思恩格斯创立的基本",
                    "B": "okkkk",
                    "C": "xxx",
                    "D": "yyy"
                },
                "answer": "AB",
                "type": "多选",
                "chooseRight": false,
                "userAnswer": ""

            },
        ]
    }
}]

let chapter = data[0];

let currentQuestion = ref(chapter.content.Achoice[0])

function prevQuestion() {
    let [titleNum, typeNum, num] = currentQuestion.value.questionNum.split('-').map(Number);

    const type = typeNum <= 1 ? "Achoice" : "ManyChoice";
    const thisModule = (data[titleNum - 1] as any).content[type];
    if (num == 1) {
        if (type == "Achoice") {
            if (titleNum <= 1) return;
            titleNum--;
        }
        const endType = type == "Achoice" ? "ManyChoice" : "Achoice";
        const res = (data[titleNum - 1] as any).content[endType];
        num = res.length;
        currentQuestion.value = res[num - 1];

    } else {
        num--;
        currentQuestion.value = thisModule[num - 1];
    }

}
function nextQuestion() {
    let [titleNum, typeNum, num] = currentQuestion.value.questionNum.split('-').map(Number);

    const type = typeNum <= 1 ? "Achoice" : "ManyChoice";
    const thisModule = (data[titleNum - 1] as any).content[type];
    if (thisModule.length == num) {
        if (type == "ManyChoice") {
            if (titleNum >= data.length) return;
            titleNum++;
        }
        const endType = type == "Achoice" ? "ManyChoice" : "Achoice";
        const res = (data[titleNum - 1] as any).content[endType];
        num = res.length;
        currentQuestion.value = res[num - 1];


    } else {
        num++;
        currentQuestion.value = thisModule[num - 1];
    }
}
let userAnswer = ref<string>("")

watchEffect(() => {
    console.log(userAnswer.value)
})
onMounted(() => {

})




</script>

<style lang="scss" scoped>
.corePart-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-around;
    padding: 2% 0%;
    overflow: hidden;
    // gap: 5%;
    position: relative;

    .hearder {
        width: 80%;
        height: 28vh;
        display: flex;
        min-width: 420px;
        max-width: 1000px;

    }

    .mbHearder {
        width: 100%;
        height: 100%;

    }

    .middle {
        width: 80%;
        height: 50vh;
        min-width: 420px;
        max-width: 1000px;
        display: flex;
        justify-content: space-between;

        .questionPart {
            box-sizing: border-box;
            width: 66%;
            height: 100%;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 2% 2%;

            .questionShow {
                width: 100%;
                height: 90%;
                box-sizing: border-box;
            }

            .switchBtn {
                width: 100%;
                height: 8%;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .prev-btn,
                .next-btn {
                    height: 100%;
                    aspect-ratio: 2;
                    border: none;
                    border-radius: 4px;
                    color: white;
                }

                .prev-btn {
                    background-color: #0d6efd;
                }

                .prev-btn:hover {
                    background-color: #0a58ca;
                }

                /* 下一页按钮（红色系） */
                .next-btn {
                    background-color: #dc3545;
                }

                .next-btn:hover {
                    background-color: #bb2d3b;
                }
            }
        }


        .navPart {
            background-color: #fff;
            box-sizing: border-box;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow-y: scroll;
            width: 30%;
            min-width: 240px;
            height: 100%;
            overflow-y: auto;
        }

        // background-color: black;
    }

    .floor {
        width: 80%;
        height: 12vh;
        min-width: 420px;
        max-width: 1000px;
        background-color: pink;
    }
}
</style>