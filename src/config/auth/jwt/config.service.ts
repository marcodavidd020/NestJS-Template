import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Servicio para acceder a la configuración de JWT
 */
@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * Obtiene el secreto para firmar los tokens JWT
   */
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'secret';
  }

  /**
   * Obtiene el tiempo de expiración para los tokens JWT
   */
  getJwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN', '1h');
  }

  /**
   * Obtiene la configuración completa para el módulo JWT
   */
  getJwtConfig() {
    return {
      secret: this.getJwtSecret(),
      signOptions: {
        expiresIn: this.getJwtExpiresIn(),
      },
    };
  }
}
