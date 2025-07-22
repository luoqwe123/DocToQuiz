import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws'; // Socket 替换为 WebSocket
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './result.entity';

@WebSocketGateway({ path: '/task' })
export class TaskWebSocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  handleConnection(client: WebSocket) {
    // 从 client 中获取 URL 并解析任务 ID
    const url = client.url;
    const taskId = url?.split('/')[2];
    if (!taskId) {
      client.close();
      return;
    }

    // 每分钟检查任务状态并推送
    const interval = setInterval(async () => {
      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      if (task) {
        const data = {
          taskId: task.id,
          status: task.status,
          progress: task.progress,
          totalTasks: task.total_tasks,
          result: task.result,
        };
        client.send(JSON.stringify(data));
        if (task.status === 'completed') {
          clearInterval(interval);
          client.close();
        }
      }
    }, 60000); // 每分钟推送一次
  }
}