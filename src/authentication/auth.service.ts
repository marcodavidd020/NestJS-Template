import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../models/users/users.service';
import { ILoginCredentials } from './interfaces/login.interface';
import { TokenSerializer } from './serializers/token.serializer';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { UserSerializer } from '../models/users/serializers/user.serializer';
import { createNotFoundResponse, createUnauthorizedResponse } from 'src/common/helpers/responses/error.helper';
import { JwtConfigService } from '../config/auth/jwt/config.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  /**
   * Convierte un tiempo de expiración en formato string (1h, 30m, 7d) a segundos
   */
  private parseExpirationTime(expTime: string): number {
    // Si es puramente numérico, devolver como está
    if (/^\d+$/.test(expTime)) {
      return parseInt(expTime, 10);
    }

    // Mapa de unidades de tiempo a segundos
    const timeUnits = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
      w: 604800,
    };

    // Extraer el número y la unidad
    const match = expTime.match(/^(\d+)([smhdw])$/);
    if (match) {
      const [, valueStr, unit] = match;
      const value = parseInt(valueStr, 10);
      return value * timeUnits[unit];
    }

    // Si el formato no es reconocido, devolver valor por defecto (1 hora)
    this.logger.warn(
      `Formato de expiración no reconocido: ${expTime}, usando valor por defecto (1h)`,
    );
    return 3600;
  }

  /**
   * Valida un usuario usando sus credenciales
   */
  async validateUser(credentials: ILoginCredentials): Promise<UserSerializer> {
    const { email, password } = credentials;

    this.logger.debug(`Intentando validar usuario: ${email}`);

    // UsersService ya tiene un método que valida la contraseña
    const user = await this.usersService.validatePassword(email, password);

    if (!user) {
      this.logger.debug(`Credenciales inválidas para: ${email}`);

      // Proporcionar información detallada del error
      throw new UnauthorizedException({
        message: 'Credenciales inválidas',
        errors: [
          {
            field: 'general',
            errors: ['El email o la contraseña son incorrectos'],
            value: null,
          },
        ],
      });
    }

    if (!user.isActive) {
      this.logger.debug(`Usuario inactivo: ${email}`);

      // Proporcionar información detallada del error
      throw new UnauthorizedException({
        message: 'Usuario inactivo',
        errors: [
          {
            field: 'general',
            errors: [
              'Tu cuenta está desactivada. Contacta con soporte para reactivarla.',
            ],
            value: null,
          },
        ],
      });
    }

    this.logger.debug(`Usuario validado correctamente: ${email}`);
    return user;
  }

  /**
   * Genera un token JWT y refresh token
   */
  async login(user: UserSerializer): Promise<TokenSerializer> {
    // Asegurar que los roles son un array
    const roles = Array.isArray(user.roles) ? user.roles : [];

    // Crear payload con datos mínimos necesarios
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      roles: roles,
    };

    this.logger.debug(
      `Generando token para usuario ${user.email} con roles: ${JSON.stringify(roles)}`,
    );

    // Obtener configuración de expiración
    const jwtExpiresIn = this.jwtConfigService.getJwtExpiresIn();
    const expiresInSeconds = this.parseExpirationTime(jwtExpiresIn);

    // Obtener configuración para refresh token
    const refreshTokenExpiresIn = this.jwtConfigService.getRefreshTokenExpiresIn();

    this.logger.debug(
      `Generando token JWT con expiración: ${jwtExpiresIn} (${expiresInSeconds} segundos)`,
    );

    // Generar tokens
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtExpiresIn,
    });

    // Generar refresh token con payload extendido
    const refreshTokenPayload = {
      ...payload,
      tokenType: 'refresh',
    };

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: refreshTokenExpiresIn,
    });

    // Devolver respuesta serializada
    return new TokenSerializer({
      accessToken,
      refreshToken,
      expiresIn: expiresInSeconds,
      tokenType: 'Bearer',
    });
  }

  /**
   * Valida un refresh token y genera nuevos tokens
   */
  async refreshTokens(refreshToken: string): Promise<TokenSerializer> {
    try {
      // Verificar el token
      const payload = this.jwtService.verify(refreshToken);
      
      // Verificar que es un refresh token
      if (payload.tokenType !== 'refresh') {
        throw new UnauthorizedException(
          createUnauthorizedResponse('Token inválido'),
        );
      }

      // Obtener el usuario
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException(
          createUnauthorizedResponse('Usuario no encontrado o inactivo'),
        );
      }

      // Generar nuevos tokens
      return this.login(user);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          createUnauthorizedResponse('El refresh token ha expirado. Inicie sesión nuevamente.'),
        );
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          createUnauthorizedResponse('Token inválido'),
        );
      }
      throw error;
    }
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  async getProfile(userId: string): Promise<UserSerializer> {
    try {
      return await this.usersService.findById(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(createNotFoundResponse('Usuario'));
    }
  }
}
