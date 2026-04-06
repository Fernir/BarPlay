// import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS для фронтенда
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true,
  });

  // ========== НАСТРОЙКА SWAGGER ==========
  const config = new DocumentBuilder()
    .setTitle('Music Chords API')
    .setDescription('API для публикации песен с аккордами')
    .setVersion('1.0')
    .addTag('songs', 'Операции с песнями')
    .addBearerAuth() // если потом добавите авторизацию
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // URL: /api-docs
  // ========================================

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🎸 Music Chords API запущен на http://localhost:${port}`);
  console.log(`📚 Swagger UI доступен на http://localhost:${port}/api-docs`);
}

bootstrap();
