import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSchema } from '../../../schema/auth.schema';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authSchema: AuthSchema,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const validation = await this.authSchema.registrationSchema(body);

    if (validation == true) {
      const register = await this.authService.register(body);
      if (register) {
        return { status: 'success' };
      } else {
        return { status: 'error', message: 'Register account failed' };
      }
    } else {
      console.log(validation);
      return { status: 'error', message: validation };
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}