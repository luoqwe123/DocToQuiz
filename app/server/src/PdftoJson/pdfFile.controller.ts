import { Body, Controller, Get, HttpCode, Post,UploadedFile,UseInterceptors } from '@nestjs/common';
import { PdfFileService } from './pdfFile.service';
import { FileInterceptor } from '@nestjs/platform-express';



@Controller('pdfFile')
export class PdfFileController {
  constructor(private readonly pdfFileService: PdfFileService) {}

  @Post("convert") @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async convert(@UploadedFile() file: Express.Multer.File) {
   
    return this.pdfFileService.getJson(file);
    
   
  }
  @Get("he") @HttpCode(200)
  he(){
    return { message:"nihao" };
  }
}
