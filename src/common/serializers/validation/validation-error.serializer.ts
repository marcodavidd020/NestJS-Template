import { Exclude, Expose } from 'class-transformer';
import { ErrorSerializer } from '../responses/error.serializer';

/**
 * Interfaz para errores de validación de campos
 */
export interface IFieldValidationError {
  field: string;
  errors: string[];
  value: any;
}

/**
 * Serializador para errores de validación
 */
@Exclude()
export class ValidationErrorSerializer extends ErrorSerializer {
  @Expose()
  declare errors: IFieldValidationError[];

  constructor(partial: Partial<ValidationErrorSerializer>) {
    super({
      statusCode: 400,
      message: partial.message || 'Error de validación',
      errors: partial.errors || [],
    });
  }
}
