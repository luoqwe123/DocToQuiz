import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadProcessor } from './pdfFile.processor';
import { v4 as uuidv4 } from 'uuid';



@Injectable()
export class PdfFileService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private readonly processor: UploadProcessor,
   
  ) { }

  async getJson(file: Express.Multer.File) {
    const taskId = uuidv4();
    console.log(taskId)
    this.processor.processPdf({ taskId, file });
   
    return {taskId};
    
  }
}
