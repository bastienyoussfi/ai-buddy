import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security middlewares
  app.use(helmet());
  app.enableCors();
  app.use(compression());

  // Global pipes and filters
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('AI Agent API Gateway')
    .setDescription('API Gateway for AI Agent microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  setupSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch(error => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
