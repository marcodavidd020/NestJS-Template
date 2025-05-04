import { Exclude, Expose } from 'class-transformer';
import { IToken } from '../interfaces/token.interface';

@Exclude()
export class TokenSerializer implements IToken {
  @Expose()
  accessToken: string;

  @Expose()
  expiresIn: number;

  @Expose()
  tokenType: string = 'Bearer';

  constructor(partial: Partial<TokenSerializer>) {
    Object.assign(this, partial);
  }
}
