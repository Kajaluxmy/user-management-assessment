import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

app.use(cookieParser());

  const frontendUrl = process.env.FRONTEND_URL;
  const allowedOrigins = frontendUrl
    ? frontendUrl.split(',').map((url) => url.trim().replace(/\/$/, ''))
    : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();