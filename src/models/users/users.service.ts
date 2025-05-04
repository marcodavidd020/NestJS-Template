import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { UserSerializer } from './serializers/user.serializer';
import { IUserCreate, IUserUpdate } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<UserSerializer[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: string): Promise<UserSerializer> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserSerializer | null> {
    return this.usersRepository.findByEmail(email);
  }

  async create(userData: CreateUserDto): Promise<UserSerializer> {
    // Verificar si el email ya existe
    const existingUser = await this.usersRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException(`Email ${userData.email} is already in use`);
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    return this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async update(
    id: string,
    userData: UpdateUserDto,
  ): Promise<UserSerializer | null> {
    // Si se proporciona una nueva contraseña, encriptarla
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    const updatedUser = await this.usersRepository.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const success = await this.usersRepository.delete(id);
    if (!success) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async validatePassword(
    email: string,
    password: string,
  ): Promise<UserSerializer | null> {
    // En este caso podemos usar directamente el método para buscar un usuario con contraseña
    const userWithPassword =
      await this.usersRepository.findUserWithPassword(email);
    if (!userWithPassword || !userWithPassword['password']) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userWithPassword['password'],
    );
    if (!isPasswordValid) {
      return null;
    }

    return this.usersRepository.findByEmail(email);
  }
}
