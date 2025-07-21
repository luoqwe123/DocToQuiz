import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { pdfTostr } from '../utils/pdfTostr';
import { fetchStream } from 'utils/request';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
  const { answers, questions } = await pdfTostr();

  const res: string = await fetchStream(questions[0].chunk);
  return { answers, res };
}
void bootstrap();
