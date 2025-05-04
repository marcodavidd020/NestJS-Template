import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Clase base para serializadores de modelos
 *
 * Implementa algunas propiedades comunes que la mayoría de modelos tendrán.
 * Extender esta clase para crear serializadores específicos.
 */
@Exclude()
export class ModelSerializer {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Identificador único',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: '2023-10-27T12:00:00.000Z',
    description: 'Fecha de creación',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-27T14:30:00.000Z',
    description: 'Fecha de última actualización',
  })
  @Expose()
  updatedAt: Date;
}
