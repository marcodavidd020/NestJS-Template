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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSerializer } from './serializers/user.serializer';
import { IUserCreate, IUserUpdate } from './interfaces/user.interface';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserSerializer[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserSerializer(user));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserSerializer> {
    const user = await this.usersService.findById(id);
    return new UserSerializer(user);
  }

  @Post()
  async create(@Body() userData: IUserCreate): Promise<UserSerializer> {
    const user = await this.usersService.create(userData);
    return new UserSerializer(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userData: IUserUpdate,
  ): Promise<UserSerializer> {
    const user = await this.usersService.update(id, userData);
    return new UserSerializer(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
  }
}
