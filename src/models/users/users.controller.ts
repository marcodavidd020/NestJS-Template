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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserSerializer } from './serializers/user.serializer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  createSuccessResponse,
  createCreatedResponse,
} from '../../common/helpers/responses/success.helper';
import {
  createNotFoundResponse,
  createErrorResponse,
} from '../../common/helpers/responses/error.helper';
import { slugify, capitalize } from '../../common/helpers/string.helper';
import { ISuccessResponse } from '../../common/interfaces/response.interface';

@ApiTags('Usuarios')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    type: [UserSerializer],
  })
  @Get()
  async findAll(): Promise<ISuccessResponse<UserSerializer[]>> {
    const users = await this.usersService.findAll();
    return createSuccessResponse(
      users.map((user) => new UserSerializer(user)),
      'Usuarios recuperados exitosamente',
    );
  }

  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: UserSerializer,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ISuccessResponse<UserSerializer>> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(createNotFoundResponse('Usuario'));
    }
    return createSuccessResponse(
      new UserSerializer(user),
      `Usuario ${capitalize(user.firstName)} encontrado`,
    );
  }

  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado',
    type: UserSerializer,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Email ya está en uso' })
  @Post()
  async create(@Body() userData: CreateUserDto): Promise<ISuccessResponse<UserSerializer>> {
    try {
      // Ejemplo de uso de slugify para crear un nombre de usuario a partir del email
      const username = slugify(userData.email.split('@')[0]);
      console.log(`Nombre de usuario generado: ${username}`);

      const user = await this.usersService.create(userData);
      return createCreatedResponse(new UserSerializer(user), 'Usuario');
    } catch (error) {
      // Solo propagamos la excepción si es una que ya conocemos
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      // Para otros errores, damos un mensaje genérico pero registramos el detalle
      throw new ConflictException(
        createErrorResponse(
          'Error al crear el usuario. Por favor, inténtelo de nuevo.',
        ),
      );
    }
  }

  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado',
    type: UserSerializer,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<ISuccessResponse<UserSerializer>> {
    const user = await this.usersService.update(id, userData);
    if (!user) {
      throw new NotFoundException(createNotFoundResponse('Usuario'));
    }
    return createSuccessResponse(
      new UserSerializer(user),
      'Usuario actualizado correctamente',
    );
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
