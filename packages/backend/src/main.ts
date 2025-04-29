import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Enable correct IP resolution behind proxies (such as Docker)
  app.set('trust proxy', true);
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();