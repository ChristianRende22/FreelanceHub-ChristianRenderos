import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activa los decoradores de class-validator en todos los DTOs
  // whitelist:true elimina campos que no están en el DTO
  // transform:true convierte strings a números cuando el DTO lo indica
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configuración de Swagger — accesible en http://localhost:3000/api
  const config = new DocumentBuilder()
    .setTitle('FreelanceHub API')
    .setDescription('API de servicios freelance — Parcial DDA ESEN 2026')
    .setVersion('1.0')
    .addBearerAuth() // Agrega el campo de token en la UI de Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 FreelanceHub API corriendo en: http://localhost:${port}`);
  console.log(`📖 Swagger docs en: http://localhost:${port}/api`);
}
bootstrap();
