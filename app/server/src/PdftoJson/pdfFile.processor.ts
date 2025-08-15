

import { PrismaService } from 'src/prisma/prisma.service';
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
  error?: string,
  title:string
}

// 内存中的任务状态存储
const taskStates = new Map<string, TaskState>();


export class UploadProcessor {
  constructor() { }

  async processPdf(data: { taskId: string; file: Express.Multer.File },prisma:PrismaService) {
    const { taskId, file } = data;
    const title = file.originalname.split('.')[0];
    console.log(title)
    // PDF 转换和 AI 处理
    const { answers, questions } = await pdfTostr(file.buffer);
    let res: Pdfdata[] = [];
    let answerRes: any = [];
    let i = -1;
    let id = 1;
    let ansIndex = 0;
    let currAns:string = '';
    // console.log(questions[0].chunk);

    // 初始化任务状态
    const task: TaskState = {
      taskId,
      status: 'processing', progress: 0, totalTasks: questions.length + answers.length, 
      currentStr: "",error:"", title
    };
    taskStates.set(taskId, task);
    try {
      currAns = answers[0].chunk;
      console.log(answers.length)
      for(let i = 0;i<answers.length;i++){
        
        const { code, data } = await fetchStream(answers[4].chunk,1);
        console.log(data)
        answerRes.push(...JSON.parse(data));
        console.log(answerRes.length)
        task.progress++;
      }
      for (i = 0; i < questions.length; i++) { 
        const questionStr = questions[i].chunk;
        console.log(questionStr,questions[i].endPosition)
        //  AI 处理
        const { code, data } = await fetchStream(questionStr, 0);
        console.log(data)
        if (code == 200) {
          const targetData: Pdfdata[] = JSON.parse(data);
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
          task.progress++;
          taskStates.set(taskId, task);

          // 每分钟更新一次
          await new Promise((resolve) => setTimeout(resolve, 60000));
        }

      }
      merge(res);
      // 任务完成
      task.status = 'completed';
      task.result = res;
      taskStates.set(taskId, task);
      console.log(prisma)
      // 存储结果到 MySQL
      await prisma.jsonresults.create({
        data:{ id: taskId, result:JSON.stringify(res),title,status:'audit' }
      });
    } catch (error) {
      console.log(error)
      task.status = 'failed';
      task.error = "token值可能设置过大(需要联系创造者修改)";
      console.log(i)
      if(i===-1) {
        task.currentStr = currAns;
      } else{ 
        task.currentStr = questions[i].chunk;
      }
      console.log(task)
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