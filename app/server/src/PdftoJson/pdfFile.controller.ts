import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PdfFileService } from './pdfFile.service';
import { FileInterceptor } from '@nestjs/platform-express';

export interface changeData{
  id: string; 
  result: string; 
  createdAt?: Date; 
  title: string; 
  descript?: string | null; 
  uploaderId?: string|null; 
  editorId?: string | null; 
  status: 'audit' | 'published'; 

  uploader?: string | null; 
  editor?: string |null; 
}

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
  @Post("changeJson") @HttpCode(200)
  changeJson(@Body() data:changeData) {
    return this.pdfFileService.updateJson(data);
  }
  @Post("changeStatus") @HttpCode(200)
  changeStatus(@Body() data:{id:string,status:string}) {
    return this.pdfFileService.changeStatus(data);
  }
  @Post("getall") @HttpCode(200)
  allData(@Body() data:{ page:number,pageSize:number }) {
    return this.pdfFileService.getAll(data.page,data.pageSize);
  }
  @Get("getallId") @HttpCode(200)
  allDataid() {
    return this.pdfFileService.getAllId();
  }
  @Delete("deleteJson/:id") @HttpCode(200)
  delete(@Param('id') id: string) {
    return this.pdfFileService.deleteById(id);
  }
}
