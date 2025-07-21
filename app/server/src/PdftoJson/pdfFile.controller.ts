import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PdfFileService } from './pdfFile.service';

@Controller('pdfFile')
export class PdfFileController {
  constructor(private readonly pdfFileService: PdfFileService) {}

  @Post()
  @HttpCode(200)
  getJson(@Body() file: File) {
    return file;
  }
}
