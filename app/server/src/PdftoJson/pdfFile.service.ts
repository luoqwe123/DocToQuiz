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
    this.processor.processPdf({ taskId, file },this.prisma);
    return {taskId};
    
  }
  async getJsonData(id?:string){
    if(!id){
      return this.getAllId()
    }
    let data = await this.prisma.jsonresults.findUnique({
      where:{
        id
      }
    })
    if(!data){
      return { message:`找不到id为${id}的数据` };
    }
    return { data:data.result,id:data.id };
  }
  async getAllId(){
    let data = await this.prisma.jsonresults.findMany({
      orderBy: {
        createdAt: 'desc', 
      },
    })
    
    return { data:data.map((item)=> item.id) };
  }
  async uploadJson(id:string,json:string){
      await this.prisma.jsonresults.update({
        where:{
          id

        },
        data:{
          result: json
        }
      })
      return { message:"修改成功" };
  }

}
