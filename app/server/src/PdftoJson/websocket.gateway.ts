import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws'; 
import { UploadProcessor } from './pdfFile.processor';


@WebSocketGateway({ path: '/task' })
export class TaskWebSocketGateway {
  @WebSocketServer()
  server: Server;

   handleConnection(client: WebSocket) {
    const url = client.url;
    const taskId = url?.split('/')[2];
    if (!taskId) {
      client.close();
      return;
    }

    const interval = setInterval(() => {
      const task = UploadProcessor.getTaskState(taskId);
      if (task) {
        client.send(JSON.stringify({
          taskId: task.taskId,
          status: task.status,
          progress: task.progress,
          totalTasks: task.totalTasks,
          result: task.result,
        }));
        if (task.status === 'completed' || task.status === 'failed') {
          clearInterval(interval);
          UploadProcessor.clearTaskState(taskId); // 清理内存
          client.close();
        }
      } else {
        client.send(JSON.stringify({
          taskId,
          status: 'error',
          error: 'Task not found',
        }));
        clearInterval(interval);
        client.close();
      }
    }, 60000); // 每分钟推送一次
  }
}