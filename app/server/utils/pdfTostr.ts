

const fs = require('fs');
const path = require("path");
const pdf = require('pdf-parse');


interface ChunkType{
    chunk:string,
    endPosition:number
}
function processText(text: string, maxChunkSize: number): ChunkType[] {
    let position = 0; // 当前位置
    const result: any = []; // 存储分块结果

    while (position < text.length) {
        // 计算初步结束位置
        let tentativeEnd = position + maxChunkSize;
        if (tentativeEnd > text.length) {
            tentativeEnd = text.length; // 超出文本长度时调整为文本末尾
        }

        // 提取当前分块
        const substring = text.substring(position, tentativeEnd);
        const lastDIndex = substring.lastIndexOf("D."); // 查找最后一个"D."

        let chunkEnd: any;
        if (lastDIndex !== -1) {
            // 找到 "D." 后的起始位置
            let afterD = position + lastDIndex + 2;
            // 在文本中从 afterD 开始查找下一个空格
            let nextSpaceIndex = text.indexOf(' ', afterD);
            if (nextSpaceIndex !== -1) {
                // 如果找到空格，chunkEnd 设置为空格后的位置
                chunkEnd = nextSpaceIndex + 1;
            } else {
                // 如果没有找到空格，使用文本末尾
                chunkEnd = text.length;
            }
        } else {
            // 未找到"D."，使用初步结束位置
            chunkEnd = tentativeEnd;
        }

        // 提取分块内容
        let chunk = text.substring(position, chunkEnd);
        result.push({
            chunk: chunk, // 分块内容
            endPosition: chunkEnd // 结束位置
        });

        // 更新位置为下一次筛选的起点
        position = chunkEnd;
    }

    return result;
}

function deleteAnswer(text: string) {
    const res: any = [];
    const answers: any = [];
    let cleanedText = text;
    const marker = "参考答案";
    while (cleanedText.indexOf(marker) !== -1) {
        // Find the start index using "参考答案："
        const startIdx = cleanedText.indexOf(marker);

        if (startIdx === -1) {
            return { answers, cleanedText };
        }
        let answerIdx = startIdx;
        for (let i = answerIdx; i < cleanedText.length; i++) {
            if (cleanedText[i + 1] == " ") {
                answerIdx = i + 1;
                break;
            }
        }

        let endIdx = startIdx + marker.length;
        let foundLastAnswer = false;
        for (let i = endIdx; i < cleanedText.length - 1; i++) {
            // 通过中文字符进行比配最后一个答案的位置
            if (/[\u4e00-\u9fa5]/.test(cleanedText[i + 1])) {
                endIdx = i;
                foundLastAnswer = true;
                break;
            }
        }
        if (!foundLastAnswer) {
            endIdx = cleanedText.length;
        }
        const answerSection = cleanedText.substring(answerIdx, endIdx).trim();
        const answerItems = answerSection.split(/\s+/);
        for (const item of answerItems) {
            const [num, ans] = item.split(".");
            if (num && ans) {
                const id = `dq${num.padStart(4, "0")}`;
                const answer = ans;
                const type = answer.length === 1 ? "Achoice" : "ManyChoice";

                answers.push({ id, answer, type });
            }
        }
        res.push(answers);
        // Clean the text by removing the reference answer section
        cleanedText = cleanedText.substring(0, startIdx) + cleanedText.substring(endIdx).trim();
    }

    return { answers: res, cleanedText };
}

export async function pdfTostr() {
    const filePath = path.join(__dirname, '../../public/test.pdf');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const text = data.text.trim().split("\n").filter((item: string) => item.trim().length > 0).join("");
    const { answers, cleanedText } = deleteAnswer(text);
    const endTextArray = processText(cleanedText, 4000);
    return { answers,questions:endTextArray };
}
