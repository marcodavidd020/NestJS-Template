import { Exclude, Expose, Type } from 'class-transformer';
import { User } from '../entities/user.entity';
import { ModelSerializer } from '../../common/serializers/model.serializer';

export class UserSerializer extends ModelSerializer {
  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Exclude()
  password: string;

  @Expose()
  isActive: boolean;

  @Expose()
  avatar: string;

  @Expose()
  roles: string[];

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  addresses: any[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
