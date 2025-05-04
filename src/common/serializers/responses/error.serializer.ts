import { Exclude, Expose } from 'class-transformer';

/**
 * Serializador para respuestas de error
 */
@Exclude()
export class ErrorSerializer {
  @Expose()
  success: boolean = false;

  @Expose()
  message: string;

  @Expose()
  statusCode: number;

  @Expose()
  errors: any[] = [];

  @Expose()
  timestamp: string;

  constructor(partial: Partial<ErrorSerializer>) {
    Object.assign(this, partial);
    this.timestamp = new Date().toISOString();
  }
}
