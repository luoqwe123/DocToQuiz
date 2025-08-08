import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { UploadProcessor } from './pdfFile.processor';
import { Logger } from '@nestjs/common';
import { IncomingMessage } from 'http';

@WebSocketGateway({
  path: '/api/task', cors: {
    origin: '*',
  },

})
export class TaskWebSocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(TaskWebSocketGateway.name);
  constructor() {
    this.logger.log('SimpleWebSocketGateway initialized');
  }
  handleConnection(client: WebSocket, request: IncomingMessage) {
    this.logger.log('WebSocket client connected');
    const url = request.url;
    const taskId = url?.split('=')[1];
    this.logger.log(`WebSocket connected: url=${url}, taskId=${taskId}`);
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
          currentStr: task.currentStr ? task.currentStr : "无错误不显示",
          error: task.error ? task.error : "无错误",
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
