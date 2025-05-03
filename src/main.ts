import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const appConfig = app.get(AppConfigService);
  
  const port = appConfig.port;
  const globalPrefix = appConfig.apiPrefix;
  
  app.setGlobalPrefix(globalPrefix);
  
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();
