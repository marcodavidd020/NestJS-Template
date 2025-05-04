import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [UsersModule, AddressesModule],
  exports: [UsersModule, AddressesModule],
})
export class ModelsModule {}
