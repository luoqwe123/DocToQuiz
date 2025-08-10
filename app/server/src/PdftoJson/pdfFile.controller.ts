import { Body, Controller, Get, HttpCode, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PdfFileService } from './pdfFile.service';
import { FileInterceptor } from '@nestjs/platform-express';



@Controller('pdfFile')
export class PdfFileController {
  constructor(private readonly pdfFileService: PdfFileService) { }

  @Post("convert") @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async convert(@UploadedFile() file: Express.Multer.File) {

    return this.pdfFileService.getJson(file);


  }
  // 接口定义（查询参数）
  @Get("find")  // 对应路径：/api/pdfFile/find?id=0c83bf87-3a8b-48bb-8294-509af8c26bb7
  @HttpCode(200)
  async findById(@Query("id") id: string) {  // 注意这里用@Query而不是@Param
    return this.pdfFileService.getJsonData(id);
  }
  @Get("he") @HttpCode(200)
  he() {
    return { message: "nihao" };
  }
  
  

}
