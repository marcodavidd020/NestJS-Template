import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { UserExists } from '../../../common/decorators/validations/UserExists';

/**
 * DTO para la creación de direcciones
 */
export class CreateAddressDto {
  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  postalCode: string;

  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsNotEmpty()
  @UserExists()
  userId: string;
} 