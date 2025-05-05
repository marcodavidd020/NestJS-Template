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
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserSerializer } from './serializers/user.serializer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  createSuccessResponse,
  createCreatedResponse,
} from '../../common/helpers/responses/success.helper';
import { createPaginatedResponse } from '../../common/helpers/responses/pagination.helper';
import {
  createNotFoundResponse,
  createErrorResponse,
} from '../../common/helpers/responses/error.helper';
import { slugify, capitalize } from '../../common/helpers/string.helper';
import { ISuccessResponse } from '../../common/interfaces/response.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SearchDto } from '../../common/dto/search.dto';
import {
  paginatedResponseSchema,
  paginationQueryParams,
  searchQueryParam,
} from '../../common/schemas/pagination.schema';

@ApiTags('Usuarios')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios (con o sin paginación)',
    schema: paginatedResponseSchema('#/components/schemas/UserSerializer'),
  })
  @ApiQuery(paginationQueryParams[0]) // page
  @ApiQuery(paginationQueryParams[1]) // limit
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<ISuccessResponse<UserSerializer[]>> {
    // Si se proporcionan parámetros de paginación, devolvemos resultados paginados
    if (paginationDto.page || paginationDto.limit) {
      const paginatedResult =
        await this.usersService.findPaginated(paginationDto);
      return createPaginatedResponse(
        paginatedResult,
        'Usuarios recuperados exitosamente',
      );
    }

    // Si no se especifican parámetros de paginación, devolvemos todos los usuarios
    const users = await this.usersService.findAll();
    return createSuccessResponse(
      users.map((user) => new UserSerializer(user)),
      'Usuarios recuperados exitosamente',
    );
  }

  @ApiOperation({ summary: 'Buscar usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda de usuarios',
    schema: paginatedResponseSchema('#/components/schemas/UserSerializer'),
  })
  @ApiQuery(searchQueryParam)
  @ApiQuery(paginationQueryParams[0]) // page
  @ApiQuery(paginationQueryParams[1]) // limit
  @Get('search')
  async search(@Query() searchDto: SearchDto): Promise<ISuccessResponse<UserSerializer[]>> {
    const searchResults = await this.usersService.search(searchDto);
    return createPaginatedResponse(
      searchResults,
      'Resultados de búsqueda recuperados exitosamente',
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
  async findById(
    @Param('id') id: string,
  ): Promise<ISuccessResponse<UserSerializer>> {
    try {
      const user = await this.usersService.findById(id);
      return createSuccessResponse(
        new UserSerializer(user),
        `Usuario ${capitalize(user.firstName)} encontrado`,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(createNotFoundResponse('Usuario'));
    }
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
  async create(
    @Body() userData: CreateUserDto,
  ): Promise<ISuccessResponse<UserSerializer>> {
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
