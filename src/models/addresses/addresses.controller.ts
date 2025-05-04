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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { AddressSerializer } from './serializers/address.serializer';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Direcciones')
@Controller('addresses')
@UseInterceptors(ClassSerializerInterceptor)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @ApiOperation({ summary: 'Obtener todas las direcciones' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar por ID de usuario' })
  @ApiResponse({ status: 200, description: 'Lista de direcciones', type: [AddressSerializer] })
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

  @ApiOperation({ summary: 'Obtener dirección por ID' })
  @ApiResponse({ status: 200, description: 'Dirección encontrada', type: AddressSerializer })
  @ApiResponse({ status: 404, description: 'Dirección no encontrada' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<AddressSerializer> {
    const address = await this.addressesService.findById(id);
    return new AddressSerializer(address);
  }

  @ApiOperation({ summary: 'Crear nueva dirección' })
  @ApiResponse({ status: 201, description: 'Dirección creada', type: AddressSerializer })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post()
  async create(
    @Body() addressData: CreateAddressDto,
  ): Promise<AddressSerializer> {
    const address = await this.addressesService.create(addressData);
    return new AddressSerializer(address);
  }

  @ApiOperation({ summary: 'Actualizar dirección' })
  @ApiResponse({ status: 200, description: 'Dirección actualizada', type: AddressSerializer })
  @ApiResponse({ status: 404, description: 'Dirección no encontrada' })
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

  @ApiOperation({ summary: 'Eliminar dirección' })
  @ApiResponse({ status: 204, description: 'Dirección eliminada' })
  @ApiResponse({ status: 404, description: 'Dirección no encontrada' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.addressesService.delete(id);
  }

  @ApiOperation({ summary: 'Establecer dirección como predeterminada' })
  @ApiResponse({ status: 200, description: 'Dirección establecida como predeterminada', type: AddressSerializer })
  @ApiResponse({ status: 404, description: 'Dirección no encontrada o no pertenece al usuario' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Put(':id/default')
  async setAsDefault(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ): Promise<AddressSerializer> {
    const address = await this.addressesService.setAsDefault(id, userId);
    return new AddressSerializer(address);
  }
}
