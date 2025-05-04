import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../models/users/users.service';
import { ILoginCredentials } from './interfaces/login.interface';
import { TokenSerializer } from './serializers/token.serializer';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { UserSerializer } from '../models/users/serializers/user.serializer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    this.logger.warn(`Formato de expiración no reconocido: ${expTime}, usando valor por defecto (1h)`);
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
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      this.logger.debug(`Usuario inactivo: ${email}`);
      throw new UnauthorizedException('Usuario inactivo');
    }

    this.logger.debug(`Usuario validado correctamente: ${email}`);
    return user;
  }

  /**
   * Genera un token JWT
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
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');
    const expiresInSeconds = this.parseExpirationTime(jwtExpiresIn);

    this.logger.debug(
      `Generando token JWT con expiración: ${jwtExpiresIn} (${expiresInSeconds} segundos)`,
    );

    // Generar token
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtExpiresIn,
    });

    // Devolver respuesta serializada
    return new TokenSerializer({
      accessToken,
      expiresIn: expiresInSeconds,
      tokenType: 'Bearer',
    });
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  async getProfile(userId: string): Promise<UserSerializer> {
    return this.usersService.findById(userId);
  }
}
