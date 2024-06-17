import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { mainConfig } from '~/config/main-config';
import { GlobalExceptionFilter } from '~/common/ExceptionFilter';
import { CustomValidationPipe } from "~/common/custom-validations";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  app.setGlobalPrefix('api/v1');

  // if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      })
      .setBasePath('v1')
      .setTitle('Telegram broker api')
      .setDescription('The telegram broker API description')
      .setVersion('1.0')
      .addTag('tg broker')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  // }


  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new GlobalExceptionFilter());
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new CustomValidationPipe(reflector));
  await app.listen(mainConfig().project.port);
}
bootstrap();
