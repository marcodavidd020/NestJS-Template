import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ProvidersModule } from './providers/providers.module';
import { ModelsModule } from './models/models.module';
import { AuthModule } from './authentication/auth.module';

@Module({
  imports: [
    ConfigModule,
    ProvidersModule,
    ModelsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
