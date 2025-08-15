import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadProcessor } from './pdfFile.processor';
import { v4 as uuidv4 } from 'uuid';
import { changeData } from './pdfFile.controller';


@Injectable()
export class PdfFileService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private readonly processor: UploadProcessor,

  ) { }

  async getJson(file: Express.Multer.File) {
    const taskId = uuidv4();

    this.processor.processPdf({ taskId, file }, this.prisma);
    return { taskId };

  }
  async getJsonData(id?: string) {
    if (!id) {
      return this.getAllId()
    }
    let data = await this.prisma.jsonresults.findUnique({
      where: {
        id
      }
    })
    if (!data) {
      return { message: `找不到id为${id}的数据` };
    }
    return { data };
  }
  async getAllId() {
    let data = await this.prisma.jsonresults.findMany({
      where: {
        status: "published"
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      data: data.map((item) => {
        return {
          id: item.id,
          title: item.title,
          describe: item.descript
        }
      })
    };
  }
  async getAll(page: number, pageSize: number) {

    const skip = (page - 1) * pageSize;

    // 执行分页查询
    const data = await this.prisma.jsonresults.findMany({
      skip: skip,           // 跳过前N条记录
      take: pageSize,       // 本次查询获取的记录数
      orderBy: {
        createdAt: 'desc',  // 保持按创建时间降序排序
      },
    });


    const total = await this.prisma.jsonresults.count();
    return {
      data,
      meta: {
        total: total,       // 总记录数
        page: page,         // 当前页码
        pageSize: pageSize, // 每页条数
        totalPages: Math.ceil(total / pageSize) // 总页数
      }
    };
  }
  async updateJson(data: changeData) {
    const updateData: any = {};

    if (data.result !== undefined && data.result !== null) {
      updateData.result = data.result;
    }

    if (data.title !== undefined && data.title !== null) {
      updateData.title = data.title;
    }
    if (data.descript !== undefined && data.descript !== null) {
      updateData.descript = data.descript;
    }

    if (data.uploaderId !== undefined && data.uploaderId !== null) {
      updateData.uploaderId = data.uploaderId;
    }

    if (data.editorId !== undefined && data.editorId !== null) {
      updateData.editorId = data.editorId;
    }

    if (data.status !== undefined && data.status !== null) {
      updateData.status = data.status;
    }

    // 执行更新操作
    await this.prisma.jsonresults.update({
      where: {
        id: data.id
      },
      data: updateData
    });

    return { message: "修改成功" };
  }
  async deleteById(id: string) {
    try {
      // 执行删除操作
      const deletedItem = await this.prisma.jsonresults.delete({
        where: {
          id: id // 根据主键ID删除
        }
      });

      // 返回删除成功的信息，包含被删除的ID
      return {
        message: "数据删除成功",
        deletedId: deletedItem.id
      };
    } catch (error) {
      console.error("删除操作失败:", error);

    }
  }
  async changeStatus(data: { id: string, status: string }) {
    await this.prisma.jsonresults.update({
      where: {
        id: data.id
      },
      data: {
        status: data.status
      }
    })
    return { message: "修改成功" };
  }

}
