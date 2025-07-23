


const fs = require('fs');
const path = require("path");
const pdf = require('pdf-parse');


interface ChunkType {
    chunk: string,
    endPosition: number
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

function deleteAnswer(textArr: string[]): { answers: string, cleanedText: string } {
    const marker = "参考答案";
    const answerLines: string[] = [];
    // let startIdx:number = -1;
    // for (const marker of markers) {
    //     startIdx = textArr.indexOf(marker);
    //     if(startIdx > 0){
    //         break;
    //     }
    // }
    
    answerLines.push(marker);
    //  筛选出答案行（包含数字和选项A/B/C/D且没有中文字符的行）
    let indexs:number[] = [];
    for(let i =0;i<  textArr.length;){
        const trimmedLine = textArr[i].trim(); 
        if (/[\d]/.test(trimmedLine) && /[A-D]/.test(trimmedLine) && !/[\u4e00-\u9fa5]/.test(trimmedLine)) {
            answerLines.push(trimmedLine);
            textArr.splice(i,1)
            continue;
        }
        if(trimmedLine.includes(marker)){
            textArr.splice(i,1);
            continue;
        }
        i++;
      
        
    }
    if (answerLines.length === 0) {
        throw new Error("参考答案无答案");
    }
    return { answers: answerLines.join(" "), cleanedText:textArr.join(" ") };
}

export async function pdfTostr(buffer: Buffer) {
    // const filePath = path.join(__dirname, '../../public/test.pdf');
    const dataBuffer = buffer;
    const data = await pdf(dataBuffer);
    
    const text: string[] = data.text.trim().split("\n").filter((item: string) => item.trim().length > 0);
    // console.log(text)
    
    const { answers, cleanedText } = deleteAnswer(text);
    console.log(answers)
    console.log("\n")
    console.log(cleanedText)
    throw new Error("aaa")
    const endTextArray = processText(cleanedText, 4000);

    return { answers, questions: endTextArray };
}
