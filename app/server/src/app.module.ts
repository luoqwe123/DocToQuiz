import { Module, Res } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PdfFileModule } from './PdftoJson/pdfFile.module';
import { BullModule } from '@nestjs/bull';

import { TaskWebSocketGateway } from './PdftoJson/websocket.gateway';
@Module({
  imports: [
    PrismaModule,PdfFileModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({}), // 不使用 Redis，仅用于队列功能
    BullModule.registerQueue({ name: 'processing' }),
  ],
  providers:[TaskWebSocketGateway]
})
export class AppModule {}
