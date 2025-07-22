import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { pdfTostr } from '../utils/pdfTostr';
import { fetchStream } from 'utils/request';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
  const { answers, questions } = await pdfTostr();
  let res: string[] = [];
  let i = 1;
  for (const question of questions) {
    const questionStr = question.chunk;
    const { code, data } = await fetchStream(questionStr);
    console.log(i++)
    if (code == 200) {
      res.push(data);
    }else{
      return { answers,res:"",status:0 }
    }
  }
  console.log(res);
  return { answers, res,status:1 };
}
void bootstrap();
