
import { Process, Processor } from '@nestjs/bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { Job } from 'bull';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ResultEntity } from './result.entity';
import { pdfTostr } from 'utils/pdfTostr';
import { fetchStream } from 'utils/request';

interface TaskState {
  taskId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  totalTasks: number;
  result?: any;
  currentStr?: string
}

// 内存中的任务状态存储
const taskStates = new Map<string, TaskState>();


export class UploadProcessor {
  constructor(private readonly prisma: PrismaService) {}

  async processPdf(data:{ taskId: string; file: Express.Multer.File }) {
    const { taskId, file } = data;
    // PDF 转换和 AI 处理
    const { answers, questions } = await pdfTostr(file.buffer);
    let res: string[] = [];
    let i = 0;
    // console.log(questions[0].chunk);

    // 初始化任务状态
    const task: TaskState = {
      taskId,
      status: 'processing', progress: 0, totalTasks: questions.length, currentStr: ""
    };
    taskStates.set(taskId, task);
    console.log(questions.length +"\n")
    try {
      for (i; i < 1; i++) { //task.totalTasks
        console.log(i,questions[i])
        const questionStr = questions[i].chunk;
        //  AI 处理
        const { code, data } = await fetchStream(questionStr);
        if (code == 200) {
          res.push(data)
          // 更新进度
          task.progress = i + 1;
          taskStates.set(taskId, task);

          // 每分钟更新一次
          await new Promise((resolve) => setTimeout(resolve, 60000));
        }

      }

      // 任务完成
      task.status = 'completed';
      task.result = res;
      taskStates.set(taskId, task);

      // 存储结果到 MySQL
      // await this.resultRepository.save({ id: taskId, result:JSON.stringify(res) });
    } catch (error) {
      task.status = 'failed';
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
