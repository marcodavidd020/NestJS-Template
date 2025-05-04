import { NestFactory } from '@nestjs/core';
import { UsersSeederService } from './seeders/users/seeder.service';
import { AddressesSeederService } from './seeders/addresses/seeder.service';
import { DatabaseModule } from './database.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(DatabaseModule);

  // Ejecutar los seeders
  const usersSeederService = appContext.get(UsersSeederService);
  const addressesSeederService = appContext.get(AddressesSeederService);

  await usersSeederService.seed();
  await addressesSeederService.seed();

  await appContext.close();
}

bootstrap();
