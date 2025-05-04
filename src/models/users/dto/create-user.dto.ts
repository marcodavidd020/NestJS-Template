import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsArray,
} from 'class-validator';
import { UniqueUserEmail } from '../../../common/decorators/validations/UniqueUserEmail';

/**
 * DTO para la creación de usuarios
 */
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @UniqueUserEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsArray()
  roles?: string[];
}
