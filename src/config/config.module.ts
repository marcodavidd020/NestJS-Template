import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigModule } from './app/config.module';
import { CacheConfigModule } from './cache/config.module';
import { DatabaseModule } from './database/database.module';
import { QueueConfigModule } from './queue/config.module';
import { SessionConfigModule } from './session/config.module';
import { StorageConfigModule } from './storage/config.module';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // App
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
        
        // PostgreSQL
        POSTGRES_HOST: Joi.string().default('localhost'),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_USERNAME: Joi.string().default('postgres'),
        POSTGRES_PASSWORD: Joi.string().default('postgres'),
        POSTGRES_DATABASE: Joi.string().default('postgres'),
        POSTGRES_SCHEMA: Joi.string().default('public'),
        POSTGRES_SYNCHRONIZE: Joi.boolean().default(false),
        POSTGRES_LOGGING: Joi.boolean().default(true),
        POSTGRES_SSL: Joi.boolean().default(false),
        POSTGRES_AUTO_LOAD_ENTITIES: Joi.boolean().default(true),
        
        // Cache
        CACHE_HOST: Joi.string().default('localhost'),
        CACHE_PORT: Joi.number().default(6379),
        CACHE_TTL: Joi.number().default(5),
        CACHE_MAX: Joi.number().default(10),
        CACHE_IS_GLOBAL: Joi.boolean().default(true),
        
        // Queue
        QUEUE_HOST: Joi.string().default('localhost'),
        QUEUE_PORT: Joi.number().default(5672),
        QUEUE_USERNAME: Joi.string().default('guest'),
        QUEUE_PASSWORD: Joi.string().default('guest'),
        QUEUE_VHOST: Joi.string().default('/'),
        
        // Session
        SESSION_SECRET: Joi.string().default('my-secret'),
        SESSION_STORE_TYPE: Joi.string().valid('memory', 'redis', 'db').default('memory'),
        
        // Storage
        STORAGE_PROVIDER: Joi.string().valid('local', 's3', 'gcs').default('local'),
        STORAGE_LOCAL_PATH: Joi.string().default('uploads'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    AppConfigModule,
    CacheConfigModule,
    DatabaseModule,
    QueueConfigModule,
    SessionConfigModule,
    StorageConfigModule,
  ],
  exports: [
    AppConfigModule, 
    CacheConfigModule, 
    DatabaseModule,
    QueueConfigModule,
    SessionConfigModule,
    StorageConfigModule,
  ],
})
export class ConfigModule {} 