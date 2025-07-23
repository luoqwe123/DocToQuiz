import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadProcessor } from './pdfFile.processor';

@Injectable()
export class PdfFileService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private readonly processor: UploadProcessor
  ) { }

  async getJson(taskId:string,file: Express.Multer.File) {
    await this.processor.processPdf({ taskId, file });
    
  }
}
