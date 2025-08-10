<template>
    <div class="corePart-container">
        <div :class="isMobilePhone ? 'mbHearder' : 'hearder'" ref="headerRef" v-if="convertShow || !isMobilePhone">
            <QuestionCover @changeConvertStatus="closeConvert" />
        </div>
        <div :class="{ middle: true, 'pc-middle': !isMobilePhone, 'mb-middle': isMobilePhone }">
            <div :class="{ questionPart: true, 'pc-questionPart': !isMobilePhone, 'mb-questionPart': isMobilePhone }">
                <QuestionShow class="questionShow" @deliverAnswer="judgAnswer" :question="currentQuestion.question"
                    :select="currentQuestion.select" :answer="currentQuestion.answer"
                    :userAnswer="currentQuestion.userAnswer" :chooseRight="currentQuestion.chooseRight"
                    :id="currentQuestion.id" :key="currentQuestion.id"></QuestionShow>
                <div class="switchBtn">
                    <button type="button" class="prev-btn" @click="prevQuestion">&lt;</button>
                    <button type="button" class="next-btn" @click="nextQuestion">&gt;</button>
                </div>
            </div>
            <div :class="isMobilePhone ? 'mbnavPart' : 'navPart'" v-if="queListShow || !isMobilePhone">
                <QuestionNav :data="data" class="questionNav" :currentQuestion="currentQuestion"
                    @changeQuelistStatus="closeList" />
            </div>
        </div>
        <div :class="isMobilePhone ? 'mbFloor' : 'floor'">
            <QuestionControl @showConvert="toShowConvert()" @showQueList="toShowQueList()" />
        </div>
    </div>

</template>

<script setup lang='ts'>

import { useScreenSize } from '@/hooks/useScreenSize';
import { onMounted, provide, ref, watchEffect } from 'vue';
import type { Chapter, ViewInfo as QuestionInfo, } from '@/types/forQuestion';
import { getJson } from '@/api/pdftoJson';
const { isMobilePhone } = useScreenSize();
const headerRef = ref<HTMLElement | null>(null)

let data = ref([{
    name: "daolun",
    content: {
        Achoice: [
            {
                "id": "dq0001",
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
                "userAnswer": ""
            },
        ],
        ManyChoice: [
            {
                "id": "dq0002",
                "questionNum": "1-2-1",
                "question": "1、广义的马克思主义是指：（  ）",
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
}])

const convertShow = ref<boolean>(true);
const queListShow = ref<boolean>(true);
let currentQuestion = ref(data.value[0].content.Achoice[0]);
function updateCurrentQuestion(newQuestion: QuestionInfo) {

    currentQuestion.value = newQuestion;
}
provide<(question: QuestionInfo) => void>("updateCurrentQuestion", updateCurrentQuestion);
function prevQuestion() {
    let [titleNum, typeNum, num] = currentQuestion.value.questionNum.split('-').map(Number);

    const type = typeNum <= 1 ? "Achoice" : "ManyChoice";
    const thisModule = (data.value[titleNum - 1] as any).content[type];
    if (num == 1) {
        if (type == "Achoice") {
            if (titleNum <= 1) return;
            titleNum--;
        }
        const endType = type == "Achoice" ? "ManyChoice" : "Achoice";
        const res = (data.value[titleNum - 1] as any).content[endType];
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
    const thisModule = (data.value[titleNum - 1] as any).content[type];
    if (thisModule.length == num) {
        if (type == "ManyChoice") {
            if (titleNum >= data.value.length) return;
            titleNum++;
        }
        const endType = type == "Achoice" ? "ManyChoice" : "Achoice";
        const res = (data.value[titleNum - 1] as any).content[endType];
        num = res.length;
        currentQuestion.value = res[num - 1];
        // console.log(currentQuestion.value)

    } else {
        num++;
        currentQuestion.value = thisModule[num - 1];
    }
}
function judgAnswer(answer: string, isRight: boolean) {
    let [titleNum, typeNum, num] = currentQuestion.value.questionNum.split('-').map(Number);

    const type = typeNum <= 1 ? "Achoice" : "ManyChoice";
    const thisQuestion = (data.value[titleNum - 1] as any).content[type][num - 1];

    thisQuestion.userAnswer = answer;
    thisQuestion.chooseRight = isRight;

    if (isRight) setTimeout(() => {
        nextQuestion();
    }, 300)

}

function toShowConvert() {
    convertShow.value = true;
}
function toShowQueList() {
    queListShow.value = true;
}
watchEffect(() => {
    if (isMobilePhone.value) {
        convertShow.value = false;
        queListShow.value = false;
    } else {
        convertShow.value = true;
        queListShow.value = true;
    }
})

function closeConvert(status: boolean) {
    convertShow.value = status;
}
function closeList(status: boolean) {
    queListShow.value = status;
}
provide<(status: boolean) => void>("closeList", closeList);
function getViewData(data: any):Chapter[] {
    for (let i = 0; i < data.length; i++) {
        let c = data[i];
        let qinfo = c.content;
        function addProp(target: any, num: number) {
            for (let j = 0; j < target.length; j++) {
                let q = target[j];
                q.userAnswer = "";
                q.chooseRight = false;
                q.questionNum = `${i+1}-${num}-${j+1}`
            }
        }
        addProp(qinfo.Achoice,1);
        addProp(qinfo.ManyChoice,2);
    }
    return data;
}
onMounted(async () => {
    let res = await getJson("0c83bf87-3a8b-48bb-8294-509af8c26bb7");
    console.log(res)
    let qs = JSON.parse(res.data.data);
    data.value = getViewData(qs);
    
    currentQuestion.value = data.value[0].content.Achoice[0]
    console.log(currentQuestion.value)

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
    // justify-content: space-around;
    padding: 3% 0%;
    overflow: hidden;
    gap: 2%;
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

    .pc-middle {
        width: 80%;
        height: 50vh;
        min-width: 420px;
        max-width: 1000px;
    }

    .mb-middle {
        width: 100%;
        height: 86vh;
    }

    .middle {

        display: flex;
        justify-content: space-between;

        .pc-questionPart {
            width: 66%;
            height: 100%;
        }

        .mb-questionPart {
            width: 100%;
            height: 100%;
        }

        .questionPart {
            box-sizing: border-box;
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
            width: 30%;
            min-width: 240px;
            height: 100%;
        }

        .mbnavPart {
            width: 100%;
            height: 100vh;
            position: fixed;
            z-index: 4;
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

    .mbFloor {
        width: 100%;
        height: 10vh;
        position: fixed;
        bottom: 0px;

    }
}
</style>