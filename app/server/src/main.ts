import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { ExpressAdapter } from '@nestjs/platform-express';

import { urlencoded, json } from 'express';


const express = require('express');
async function bootstrap() {

 const expressApp = express();
  expressApp.use(json({ limit: '3mb' }));

  // 配置 URL 编码请求体大小限制
  expressApp.use(urlencoded({ extended: true, limit: '3mb' }));

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new WsAdapter(app)); // 使用 @nestjs/platform-ws 的适配器
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
  
  
}
void bootstrap();
 