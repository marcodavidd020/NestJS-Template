import { IsOptional, MinLength, IsArray, IsBoolean } from 'class-validator';

/**
 * DTO para la actualización de usuarios
 */
export class UpdateUserDto {
  @IsOptional()
  @MinLength(2)
  firstName?: string;

  @IsOptional()
  @MinLength(2)
  lastName?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  roles?: string[];
}
