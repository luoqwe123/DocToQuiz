import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { pdfTostr } from 'utils/pdfTostr';
import { fetchStream } from 'utils/request';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class PdfFileService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    @InjectQueue('pdf-processing') private pdfQueue: Queue
  ) { }

  async getJson(taskId:string,file: Express.Multer.File) {
    // console.log(file)
    // console.log("\n"+"aaa")
    const { answers, questions } = await pdfTostr(file.buffer);
    let res: string[] = [];
    let i = 1;
    console.log(questions[0].chunk);
    // for (const question of questions) {
    //   const questionStr = question.chunk;
    //   const { code, data } = await fetchStream(questionStr);
    //   console.log(i++)
    //   if (code == 200) {
    //     res.push(data);
    //   } else {
    //     return { answers, res: "", status: 0 }
    //   }
    // }
    // console.log(res);
    return { code:200, res, status: 1 };
    return file;
  }
}
