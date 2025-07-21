import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PdfFileService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

   getJson(file: File) {
    return file;
  }
}
