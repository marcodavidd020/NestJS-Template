import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersSeederModule } from './seeders/users/seeder.module';
import { AddressesSeederModule } from './seeders/addresses/seeder.module';
import { PostgresConfigModule } from '../config/database/postgres/config.module';
import { PostgresConfigService } from '../config/database/postgres/config.service';

/**
 * Módulo de base de datos
 *
 * Este módulo centraliza:
 * 1. Conexión a la base de datos (usando la configuración de /config/database)
 * 2. Migraciones (estructura de tablas)
 * 3. Seeders (datos iniciales)
 *
 * La configuración de la conexión se gestiona desde /config/database
 * Los proveedores específicos se manejan desde /providers/database
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      inject: [PostgresConfigService],
      useFactory: (dbConfigService: PostgresConfigService) => ({
        ...dbConfigService.getTypeOrmConfig(),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsTableName: 'migrations',
        synchronize: false,
        logging: ['error', 'migration', 'warn'],
      }),
    }),
    UsersSeederModule,
    AddressesSeederModule,
  ],
  exports: [UsersSeederModule, AddressesSeederModule],
})
export class DatabaseModule {}
