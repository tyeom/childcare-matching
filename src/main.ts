import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT || 3002;
  const HOST = process.env.HOST || '0.0.0.0';

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('E-SIGNATURE')
    .setDescription('E-SIGNATURE APIs')
    .setVersion('1.0')
    .addBasicAuth()
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.init();
  await app.listen(PORT, HOST);
  console.log(`App is running at http://${HOST}:${PORT}`);
}
bootstrap();
