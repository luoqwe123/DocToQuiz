import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PdfFileModule } from './PdftoJson/pdfFile.module';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './PdftoJson/result.entity';
@Module({
  imports: [
    PrismaModule,PdfFileModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({}), // 不使用 Redis，仅用于队列功能
    BullModule.registerQueue({ name: 'processing' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'task_processing',
      entities: [TaskEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaskEntity]),
  ],
})
export class AppModule {}
