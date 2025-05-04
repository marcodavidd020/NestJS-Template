import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ModelRepository } from '../../common/repositories/model.repository';
import { UserSerializer } from '../serializers/user.serializer';
import { IUserCreate, IUserUpdate } from '../interfaces/user.interface';

@Injectable()
export class UsersRepository extends ModelRepository<User, UserSerializer> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(UserSerializer);
    this.manager = dataSource.manager;
    this.repository = dataSource.getRepository(User);
    this.metadata = this.repository.metadata;
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll(): Promise<UserSerializer[]> {
    return this.getAll(['addresses']);
  }

  /**
   * Buscar usuario por id
   */
  async findById(id: string): Promise<UserSerializer | null> {
    return this.get(id, ['addresses']);
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email: string): Promise<UserSerializer | null> {
    return this.getBy({ email }, [], false);
  }

  /**
   * Buscar usuario con contraseña (para login)
   * TypeORM oculta el campo password por default,
   * necesitamos usar un approach diferente para obtenerlo
   */
  async findUserWithPassword(email: string): Promise<User | null> {
    try {
      // Usando findOneBy con select explícito para incluir todos los campos necesarios
      const user = await this.repository.findOne({
        where: { email },
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'isActive',
          'avatar',
          'roles',
          'phoneNumber',
          'password', // Incluye explícitamente el password
          'createdAt',
          'updatedAt',
        ],
      });

      if (user) {
        console.log('Usuario encontrado, password presente:', !!user.password);
      }

      return user;
    } catch (error) {
      console.error(
        `Error al buscar usuario con contraseña: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Crear un nuevo usuario
   */
  async create(userData: IUserCreate): Promise<UserSerializer> {
    return this.createEntity(userData, ['addresses']);
  }

  async update(
    id: string,
    userData: IUserUpdate,
  ): Promise<UserSerializer | null> {
    return this.updateEntity(id, userData, ['addresses']);
  }

  /**
   * Eliminar un usuario
   */
  async delete(id: string): Promise<boolean> {
    return this.deleteEntity(id);
  }
}
