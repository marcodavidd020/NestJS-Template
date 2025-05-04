import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { ModelSerializer } from '../../common/serializers/model.serializer';

export class UserSerializer extends ModelSerializer {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Email del usuario',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
  })
  @Expose()
  lastName: string;

  @Exclude()
  password: string;

  @ApiProperty({
    example: true,
    description: 'Estado activo/inactivo del usuario',
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    example: 'https://ejemplo.com/avatar.jpg',
    description: 'URL del avatar del usuario',
    nullable: true,
  })
  @Expose()
  avatar: string;

  @ApiProperty({
    example: ['user', 'admin'],
    description: 'Roles del usuario',
    type: [String],
  })
  @Expose()
  roles: string[];

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @ApiProperty({
    type: 'array',
    description: 'Direcciones asociadas al usuario',
  })
  @Expose()
  addresses: any[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
