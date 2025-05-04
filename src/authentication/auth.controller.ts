import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenSerializer } from './serializers/token.serializer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserSerializer } from '../models/users/serializers/user.serializer';
import { LoggedInUser } from '../common/decorators/requests/logged-in-user.decorator';
import { IJwtUser } from './interfaces/jwt-user.interface';

@ApiTags('Autenticación')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Iniciar sesión', description: 'Obtiene un token JWT a partir de credenciales válidas' })
  @ApiResponse({ status: 201, description: 'Login exitoso', type: TokenSerializer })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenSerializer> {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Obtener perfil de usuario', description: 'Obtiene el perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil recuperado con éxito', type: UserSerializer })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@LoggedInUser() user: IJwtUser): Promise<UserSerializer> {
    return this.authService.getProfile(user.id);
  }

  @ApiOperation({ summary: 'Renovar token', description: 'Renovar el token JWT actual' })
  @ApiResponse({ status: 200, description: 'Token renovado con éxito', type: TokenSerializer })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('refresh-token')
  async refreshToken(@LoggedInUser() user: IJwtUser): Promise<TokenSerializer> {
    const userProfile = await this.authService.getProfile(user.id);
    return this.authService.login(userProfile);
  }
}
