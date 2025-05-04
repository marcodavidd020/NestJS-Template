import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenSerializer } from './serializers/token.serializer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserSerializer } from '../models/users/serializers/user.serializer';
import { LoggedInUser } from '../common/decorators/requests/logged-in-user.decorator';
import { IJwtUser } from './interfaces/jwt-user.interface';

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
  async getProfile(@LoggedInUser() user: IJwtUser): Promise<UserSerializer> {
    return this.authService.getProfile(user.id);
  }
}
