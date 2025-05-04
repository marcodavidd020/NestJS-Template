import { IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

/**
 * DTO para la actualización de direcciones
 */
export class UpdateAddressDto {
  @IsOptional()
  @IsNotEmpty()
  street?: string;

  @IsOptional()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsNotEmpty()
  state?: string;

  @IsOptional()
  @IsNotEmpty()
  postalCode?: string;

  @IsOptional()
  @IsNotEmpty()
  country?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
} 