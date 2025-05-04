import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressSerializer } from './serializers/address.serializer';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
@UseInterceptors(ClassSerializerInterceptor)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async findAll(
    @Query('userId') userId?: string,
  ): Promise<AddressSerializer[]> {
    let addresses: AddressSerializer[];

    if (userId) {
      addresses = await this.addressesService.findByUserId(userId);
    } else {
      addresses = await this.addressesService.findAll();
    }

    return addresses.map((address) => new AddressSerializer(address));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<AddressSerializer> {
    const address = await this.addressesService.findById(id);
    return new AddressSerializer(address);
  }

  @Post()
  async create(
    @Body() addressData: CreateAddressDto,
  ): Promise<AddressSerializer> {
    const address = await this.addressesService.create(addressData);
    return new AddressSerializer(address);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() addressData: UpdateAddressDto,
  ): Promise<AddressSerializer> {
    const address = await this.addressesService.update(id, addressData);
    if (!address) {
      throw new NotFoundException(`Dirección con ID ${id} no encontrada`);
    }
    return new AddressSerializer(address);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.addressesService.delete(id);
  }

  @Put(':id/default')
  async setAsDefault(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ): Promise<AddressSerializer> {
    const address = await this.addressesService.setAsDefault(id, userId);
    return new AddressSerializer(address);
  }
}
