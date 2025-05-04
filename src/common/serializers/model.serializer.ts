import { Exclude, Expose } from 'class-transformer';

/**
 * Clase base para serializadores de modelos
 *
 * Implementa algunas propiedades comunes que la mayoría de modelos tendrán.
 * Extender esta clase para crear serializadores específicos.
 */
@Exclude()
export class ModelSerializer {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
