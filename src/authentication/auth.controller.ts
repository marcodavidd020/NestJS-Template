import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenSerializer } from './serializers/token.serializer';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserSerializer } from '../models/users/serializers/user.serializer';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenSerializer> {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserSerializer> {
    return this.authService.getProfile(req.user.id);
  }
}
