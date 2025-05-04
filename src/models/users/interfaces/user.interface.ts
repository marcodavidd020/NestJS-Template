import { Address } from '../../addresses/entities/address.entity';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  isActive: boolean;
  avatar?: string;
  roles?: string[];
  addresses?: Address[];
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
}

export interface IUserCreate {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar?: string;
  roles?: string[];
}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
  password?: string;
  avatar?: string;
  isActive?: boolean;
  roles?: string[];
}
