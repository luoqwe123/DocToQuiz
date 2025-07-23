import { Body, Controller, Get, HttpCode, Post,UploadedFile,UseInterceptors } from '@nestjs/common';
import { PdfFileService } from './pdfFile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';


@Controller('pdfFile')
export class PdfFileController {
  constructor(private readonly pdfFileService: PdfFileService) {}

  @Post("convert") @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async convert(@UploadedFile() file: Express.Multer.File) {
    const taskId = uuidv4();
    await this.pdfFileService.getJson(taskId,file);
    console.log(taskId)
    return { taskId };
  }
  @Get("he") @HttpCode(200)
  he(){
    return { message:"nihao" };
  }
}
