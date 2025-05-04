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

  async findAll(): Promise<UserSerializer[]> {
    return this.getAll(['addresses']);
  }

  async findById(id: string): Promise<UserSerializer | null> {
    return this.get(id, ['addresses']);
  }

  async findByEmail(email: string): Promise<UserSerializer | null> {
    return this.getBy({ email }, [], false);
  }

  async create(userData: IUserCreate): Promise<UserSerializer> {
    return this.createEntity(userData, ['addresses']);
  }

  async update(
    id: string,
    userData: IUserUpdate,
  ): Promise<UserSerializer | null> {
    return this.updateEntity(id, userData, ['addresses']);
  }

  async delete(id: string): Promise<boolean> {
    return this.deleteEntity(id);
  }
}
