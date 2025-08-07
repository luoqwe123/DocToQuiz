
import { Process, Processor } from '@nestjs/bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { Job } from 'bull';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ResultEntity } from './result.entity';
import { pdfTostr } from 'utils/pdfTostr';
import { fetchStream } from 'utils/request';
import type { Pdfdata } from "./type"

const sign = "dp";
interface TaskState {
  taskId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  totalTasks: number;
  result?: any;
  currentStr?: string,
  error?: string
}

// 内存中的任务状态存储
const taskStates = new Map<string, TaskState>();


export class UploadProcessor {
  constructor(private readonly prisma: PrismaService) { }

  async processPdf(data: { taskId: string; file: Express.Multer.File }) {
    const { taskId, file } = data;
    // PDF 转换和 AI 处理
    const { answers, questions } = await pdfTostr(file.buffer);
    let res: Pdfdata[] = [];
    let answerRes: any = [];
    let i = 0;
    let id = 1;
    let ansIndex = 0;
    // console.log(questions[0].chunk);

    // 初始化任务状态
    const task: TaskState = {
      taskId,
      status: 'processing', progress: 0, totalTasks: questions.length + answers.length, currentStr: ""
    };
    taskStates.set(taskId, task);
    console.log(questions.length + "\n")
    try {
      // console.log(answers[0].chunk)
      // for(let i = 0;i<2;i++){
      //   const { code, data } = await fetchStream(answers[i].chunk,1);
      //   answerRes.push(...JSON.parse(data))
      //   console.log(typeof JSON.parse(data))
      // }


      for (i = 1; i < 2; i++) { //task.totalTasks

        const questionStr = questions[i].chunk;
        console.log(questionStr)
        //  AI 处理
        console.log("\n")
        const { code, data } = await fetchStream(questionStr, 0);
        console.log(data)
        if (code == 200) {
          const targetData: Pdfdata[] = JSON.parse(data);
          merge(targetData);
          for (const d of targetData) {
            let achoice = d.content.Achoice;
            let manyChoice = d.content.ManyChoice;
            function addAns(arr:any) {
              if (arr) {
                for (const q of arr) {
                  q.id = sign + id.toString().padStart(4, "0")
                  ansIndex < answerRes.length && (q.answer = answerRes[ansIndex].answer);
                  ansIndex++;
                  id++
                }
              }
            }
            addAns(achoice);
            addAns(manyChoice);
          }
          res.push(...targetData);
          // 更新进度
          task.progress = i + 1;
          taskStates.set(taskId, task);

          // 每分钟更新一次
          await new Promise((resolve) => setTimeout(resolve, 60000));
        }

      }
      console.log(res)
      // 任务完成
      task.status = 'completed';
      task.result = res;
      taskStates.set(taskId, task);

      // 存储结果到 MySQL
      // await this.resultRepository.save({ id: taskId, result:JSON.stringify(res) });
    } catch (error) {
      //console.log(error)
      task.status = 'failed';
      task.error = "token值设置过大，需要联系创造者修改";
      task.currentStr = questions[i].chunk;
      taskStates.set(taskId, task);
    }
  }

  // 提供方法给 WebSocket 获取任务状态
  static getTaskState(taskId: string): TaskState | undefined {
    return taskStates.get(taskId);
  }

  // 清理任务状态
  static clearTaskState(taskId: string) {
    taskStates.delete(taskId);
  }

  // 你的 PDF 转换逻辑
  private convertPdfToCharArray(filePath: string): string[] {
    return Array(8).fill('mock-char'); // 替换为你的实现
  }

  // 你的 AI 处理逻辑
  private processWithAI(char: string): any {
    return { processed: char }; // 替换为你的实现
  }
}


function merge(arr: any) {
  for (let i = 0; i < arr.length;) {
    let d = arr[i];
    if (d.name === "0") {
      if (d.content.Achoice.length != 0) {
        arr[i - 1].content.Achoice.push(...d.content.Achoice);
        arr[i - 1].content.ManyChoice = arr[i].content.ManyChoice;
      } else {
        arr[i - 1].content.ManyChoice.push(...d.content.ManyChoice);
      }
      arr.splice(i, 1);
      continue;
    }
    i++;
  }
}