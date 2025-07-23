import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new WsAdapter(app)); // 使用 @nestjs/platform-ws 的适配器
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
  
  
}
void bootstrap();
