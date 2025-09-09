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
                    <button type="button" class="addq" @click="addErrorqs"
                        v-if="props.function !== 'errorbook'">保存到错题本</button>
                    <button type="button" class="next-btn" @click="nextQuestion">&gt;</button>
                </div>
            </div>
            <div :class="isMobilePhone ? 'mbnavPart' : 'navPart'" v-if="queListShow || !isMobilePhone">
                <QuestionNav :data="data" class="questionNav" :currentQuestion="currentQuestion"
                    @changeQuelistStatus="closeList" />
            </div>
        </div>
        <div :class="isMobilePhone ? 'mbFloor' : 'floor'">
            <QuestionControl @showConvert="toShowConvert()" @showQueList="toShowQueList()"
                @showErrorBook="enterErrorBook" @cleanNote="cleanNote" @saveNote="saveNote" />
        </div>
    </div>

</template>

<script setup lang='ts'>

import { useScreenSize } from '@/hooks/useScreenSize';
import { onMounted, provide, ref, watch, watchEffect } from 'vue';
import type { Chapter, ViewInfo as QuestionInfo, } from '@/types/forQuestion';
import { getJson, type JsonData } from '@/api/pdftoJson';
import { getJsonData, saveJsonData, deleteJsonData } from "@/utils/indexDB";
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
let route = useRoute();
const { isMobilePhone } = useScreenSize();
const headerRef = ref<HTMLElement | null>(null);

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
}]);

const props = defineProps<{
    id?: string,
    function?: string
}>();

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
async function addErrorqs() {
    let res: string | null | JsonData = await getJsonData(props.id! + "errorbook");
    // console.log(res);
    let newBook = null;
    if (res) {
        newBook = JSON.parse(res);
    } else {
        newBook = JSON.parse(JSON.stringify(data.value));
        for (const c of newBook) {
            let content = c.content;
            content.Achoice = [];
            content.ManyChoice = [];
        }
        // console.log(newBook);
    }
    let [titleNum, typeNum] = currentQuestion.value.questionNum.split('-').map(Number);
    const type = typeNum <= 1 ? "Achoice" : "ManyChoice";
    const thisModule = (newBook[titleNum - 1] as any).content[type];
    thisModule.push(currentQuestion.value);
    thisModule.sort((a: any, b: any) => {
        let num1 = a.questionNum.split('-').map(Number)[2];
        let num2 = b.questionNum.split('-').map(Number)[2];
        return num1 - num2;
    });
    // console.log(newBook);
    let message = await saveJsonData(props.id! + "errorbook", JSON.stringify(newBook));
    if (message === "success") {
        ElMessage.success("保存成功");
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
    }, 300);

}

function toShowConvert() {
    convertShow.value = true;
}
function toShowQueList() {
    queListShow.value = true;
}

async function saveNote() {
    let res = await saveJsonData(props.id! + props.function, JSON.stringify(data.value));
    if (res === "success") {
        ElMessage.success("保存成功");
    }
}
async function cleanNote() {
    let res = await deleteJsonData(props.id! + props.function);
    if (res === "success") {
        ElMessage.success("清除成功");
    }
}
function enterErrorBook() {
    if (props.function === "errorbook") return;
    router.push({
        name: "start",
        params: {
            id: props.id,
            function: "errorbook"
        }

    });
}
watchEffect(() => {
    if (isMobilePhone.value) {
        convertShow.value = false;
        queListShow.value = false;
    } else {
        convertShow.value = true;
        queListShow.value = true;
    }
});

function closeConvert(status: boolean) {
    convertShow.value = status;
}
function closeList(status: boolean) {
    queListShow.value = status;
}
provide<(status: boolean) => void>("closeList", closeList);
function getViewData(data: any): Chapter[] {
    for (let i = 0; i < data.length; i++) {
        let c = data[i];
        let qinfo = c.content;
        function addProp(target: any, num: number) {
            for (let j = 0; j < target.length; j++) {
                let q = target[j];
                q = {
                    ...q,
                    userAnswer: '',
                    chooseRight: false,
                    questionNum: `${i + 1}-${num}-${j + 1}`
                };
                target[j] = q;

            }
        }
        addProp(qinfo.Achoice, 1);
        addProp(qinfo.ManyChoice, 2);
    }
    return data;
}

watch(
    () => route.params, // 监听 params 对象
    (newParams, oldParams) => {
        if (newParams !== oldParams) { // 避免重复执行
            init();
        }
    },
    { deep: true } // 深度监听，确保参数内部变化也能被捕获
);
async function init() {
    if (props.function === "start") {
        return;
    }
    let res: string | null | JsonData = await getJsonData(props.id! + props.function);
    if (props.function === "errorbook") {
        // console.log(res)
        if (res) {
            data.value = JSON.parse(res);
        } else {
            ElMessage.error("还没有添加错题");
        }
    }
    if (props.function === "data") {
        if (res) {
            data.value = JSON.parse(res);
        } else {
            res = await getJson(props.id);
            let qs = JSON.parse(res.data.data.result);
            // console.log(qs);
            data.value = getViewData(qs);
            await saveJsonData(props.id!, JSON.stringify(data.value));
        }
    }
    // console.log(data.value)
    currentQuestion.value = data.value[0].content.Achoice[0];
    // console.log(currentQuestion.value)

}
onMounted(init);




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

                .addq {
                    padding: 6px;
                    height: 100%;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    background-color: #17a2b8;
                }

                .addq:hover {
                    background-color: #138496;
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