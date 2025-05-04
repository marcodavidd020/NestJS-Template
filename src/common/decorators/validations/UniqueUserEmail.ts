import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../models/users/users.service';

/**
 * Constraint para validar que un email de usuario es único
 */
@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueUserEmailConstraint implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(email: string, args: ValidationArguments) {
    if (!email) return false;

    try {
      const user = await this.usersService.findByEmail(email);
      return !user; // Email es único si no existe usuario con ese email
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `El email "${args.value}" ya está en uso`;
  }
}

/**
 * Decorador para validar que un email de usuario es único
 *
 * Uso:
 * class CreateUserDto {
 *   @UniqueUserEmail()
 *   email: string;
 * }
 */
export function UniqueUserEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueUserEmailConstraint,
    });
  };
}
