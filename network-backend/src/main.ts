import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '@/swagger/swagger.config';
import { json, urlencoded } from 'express';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { useContainer } from 'class-validator';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:5672`],
      queue: 'recommendation_queue',
      queueOptions: { durable: true },
    },
  });

  app.useGlobalInterceptors(new TransformInterceptor());
  const configService = app.get(ConfigService);
  const bodyLimit = configService.get<string>('BODY_LIMIT') || '10mb';

  setupSwagger(app);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(json({ limit: bodyLimit }));
  app.use(urlencoded({ extended: true, limit: bodyLimit }));
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('PORT') || 3000);
}

bootstrap();
