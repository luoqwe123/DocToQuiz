import { Module } from '@nestjs/common';
import { PdfFileController } from './pdfFile.controller';
import { PdfFileService } from './pdfFile.service';
@Module({
  controllers: [PdfFileController],
  providers: [PdfFileService],
})
export class PdfFileModule {}
