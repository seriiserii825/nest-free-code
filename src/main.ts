import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from "@nestjs/common";

// Load .env BEFORE creating the app
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет поля, которых нет в DTO
      forbidNonWhitelisted: true, // ошибка, если прислали лишнее поле
      transform: true, // включить class-transformer
      transformOptions: {
        enableImplicitConversion: true, // автоматически приводит типы
      },
    })
  );
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
