import { Exclude, Expose, Transform } from 'class-transformer';
import { Address } from '../entities/address.entity';
import { ModelSerializer } from '../../common/serializers/model.serializer';

export class AddressSerializer extends ModelSerializer {
  @Expose()
  street: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  postalCode: string;

  @Expose()
  country: string;

  @Expose()
  isDefault: boolean;

  @Exclude()
  user: any;

  @Expose()
  @Transform(({ obj }) => obj.user?.id)
  userId: string;

  constructor(partial: Partial<Address>) {
    super();
    Object.assign(this, partial);
  }
}
