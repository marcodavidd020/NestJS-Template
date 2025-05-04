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
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserSerializer } from './serializers/user.serializer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Usuarios')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [UserSerializer] })
  @Get()
  async findAll(): Promise<UserSerializer[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserSerializer(user));
  }

  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserSerializer })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserSerializer> {
    const user = await this.usersService.findById(id);
    return new UserSerializer(user);
  }

  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado', type: UserSerializer })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Email ya está en uso' })
  @Post()
  async create(@Body() userData: CreateUserDto): Promise<UserSerializer> {
    try {
      const user = await this.usersService.create(userData);
      return new UserSerializer(user);
    } catch (error) {
      // Solo propagamos la excepción si es una que ya conocemos
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      
      // Para otros errores, damos un mensaje genérico pero registramos el detalle
      throw new ConflictException('Error al crear el usuario. Por favor, inténtelo de nuevo.');
    }
  }

  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: UserSerializer })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<UserSerializer> {
    const user = await this.usersService.update(id, userData);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return new UserSerializer(user);
  }

  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
  }
}
