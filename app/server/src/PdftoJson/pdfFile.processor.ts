import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './result.entity';

@Processor('processing')
export class TaskProcessor {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  @Process()
  async processTask(job: Job<{ taskId: string; filePath: string }>) {
    const { taskId } = job.data;
    const totalTasks = 5; // 假设总共有 5 个步骤

    // 初始化任务
    let task = new TaskEntity();
    task.id = taskId;
    task.status = 'processing';
    task.progress = 0;
    task.total_tasks = totalTasks;
    await this.taskRepository.save(task);

    // 模拟任务处理
    const result = { data: [] as string[] }; // 最终数据结构
    for (let i = 0; i < totalTasks; i++) {
      // 模拟处理逻辑
      result.data.push(`Step ${i + 1} completed`);

      // 更新进度
      task.progress = i + 1;
      await this.taskRepository.save(task);

      // 每分钟更新一次（模拟 1 分钟）
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }

    // 任务完成
    task.status = 'completed';
    task.result = result;
    await this.taskRepository.save(task);
  }
}