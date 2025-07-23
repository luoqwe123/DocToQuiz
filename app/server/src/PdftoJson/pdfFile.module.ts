import { Module } from '@nestjs/common';
import { PdfFileController } from './pdfFile.controller';
import { PdfFileService } from './pdfFile.service';


import { TaskWebSocketGateway } from './websocket.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploadProcessor } from './pdfFile.processor';
@Module({
  imports:[
    PrismaModule,
  ],
  controllers: [PdfFileController],
  providers: [PdfFileService,TaskWebSocketGateway,UploadProcessor],
})
export class PdfFileModule {}
