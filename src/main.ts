import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { ValidationPipe as CustomValidationPipe } from './common/pipes/validation.pipe';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const appConfig = app.get(AppConfigService);
  
  const port = appConfig.port;
  const globalPrefix = appConfig.apiPrefix;
  
  app.setGlobalPrefix(globalPrefix);
  
  // Usar nuestro ValidationPipe personalizado en lugar del estándar
  app.useGlobalPipes(new CustomValidationPipe());
  
  // Registrar el interceptor de transformación de respuestas
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API de la estructura base de NestJS')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Introduce tu token JWT',
        in: 'header',
      },
      'JWT-auth', // Este nombre se usará para referenciar este esquema de seguridad
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();
