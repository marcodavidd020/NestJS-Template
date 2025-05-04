import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entities/address.entity';
import { ModelRepository } from '../../common/repositories/model.repository';
import { AddressSerializer } from '../serializers/address.serializer';
import {
  IAddressCreate,
  IAddressUpdate,
} from '../interfaces/address.interface';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AddressesRepository extends ModelRepository<
  Address,
  AddressSerializer
> {
  private readonly userRepository: Repository<User>;

  constructor(@InjectDataSource() dataSource: DataSource) {
    super(AddressSerializer);
    this.manager = dataSource.manager;
    this.repository = dataSource.getRepository(Address);
    this.userRepository = dataSource.getRepository(User);
    this.metadata = this.repository.metadata;
  }

  async findAll(): Promise<AddressSerializer[]> {
    return this.getAll(['user']);
  }

  async findById(id: string): Promise<AddressSerializer | null> {
    return this.get(id, ['user']);
  }

  async findByUserId(userId: string): Promise<AddressSerializer[]> {
    return this.getAllBy({ user: { id: userId } }, ['user']);
  }

  async create(addressData: IAddressCreate): Promise<AddressSerializer> {
    const { userId, ...data } = addressData;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Si la dirección se establece como predeterminada, actualizar las otras direcciones
    if (data.isDefault) {
      await this.update(
        { user: { id: userId }, isDefault: true },
        { isDefault: false },
      );
    }

    const inputs = {
      ...data,
      user,
    };

    return this.createEntity(inputs, ['user']);
  }

  async update(where: any, addressData: IAddressUpdate): Promise<any> {
    return this.repository.update(where, addressData);
  }

  async updateById(
    id: string,
    addressData: IAddressUpdate,
  ): Promise<AddressSerializer | null> {
    const address = await this.get(id, ['user'], true);

    // Como estamos usando throwsException = true en get(),
    // si address es null, ya se habrá lanzado una excepción
    // y no llegaremos a este punto.

    // Si la dirección se establece como predeterminada, actualizar las otras direcciones
    if (addressData.isDefault && !address!.isDefault) {
      await this.update(
        { user: { id: address!.user?.id } },
        { isDefault: false },
      );
    }

    return this.updateEntity(id, addressData, ['user']);
  }

  async delete(id: string): Promise<boolean> {
    return this.deleteEntity(id);
  }
}
