import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../models/users/users.service';
import { ILoginCredentials } from './interfaces/login.interface';
import { TokenSerializer } from './serializers/token.serializer';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { UserSerializer } from '../models/users/serializers/user.serializer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Valida un usuario usando sus credenciales
   */
  async validateUser(credentials: ILoginCredentials): Promise<UserSerializer> {
    const { email, password } = credentials;
    
    // UsersService ya tiene un método que valida la contraseña
    const user = await this.usersService.validatePassword(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }
    
    return user;
  }

  /**
   * Genera un token JWT
   */
  async login(user: UserSerializer): Promise<TokenSerializer> {
    // Crear payload con datos mínimos necesarios
    const payload: IJwtPayload = {
      sub: user.id, // sub es estándar en JWT para el ID
      email: user.email,
      roles: user.roles,
    };

    // Obtener expiración desde configuración
    const expiresIn = parseInt(this.configService.get<string>('JWT_EXPIRES_IN', '3600'), 10);

    // Generar token
    const accessToken = this.jwtService.sign(payload, {
      expiresIn,
    });

    // Devolver serializer
    return new TokenSerializer({
      accessToken,
      expiresIn,
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