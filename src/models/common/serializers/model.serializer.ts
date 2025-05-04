import { Expose } from 'class-transformer';

export abstract class ModelSerializer {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
