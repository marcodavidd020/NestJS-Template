import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IToken } from '../interfaces/token.interface';

@Exclude()
export class TokenSerializer implements IToken {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de acceso JWT',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    example: 3600,
    description: 'Tiempo de expiración en segundos',
  })
  @Expose()
  expiresIn: number;

  @ApiProperty({
    example: 'Bearer',
    description: 'Tipo de token',
  })
  @Expose()
  tokenType: string = 'Bearer';

  constructor(partial: Partial<TokenSerializer>) {
    Object.assign(this, partial);
  }
}
