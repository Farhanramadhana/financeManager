import { Controller, Get, Put, Request, UseGuards, Body } from '@nestjs/common';
import { UserSchema } from '../../../schema/user.schema';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/user')
export class UserController {
  constructor(
    private userService: UserService,
    private userSchema: UserSchema,
  ) {}

  @Get('profile')
  async getUserById(@Request() req) {
    const userData = await this.userService.getUserById(req.user);
    return { status: 'success', data: userData };
  }

  @Put('update')
  async updateUser(@Request() req, @Body() body: UpdateUserDto) {
    const validation = await this.userSchema.updateUserSchema(body);

    if (validation == true) {
      const update = await this.userService.updateUser(body, req.user);
      if (update) {
        const data = await this.userService.getUserById(req.user);
        return { status: 'success', data };
      } else {
        return { status: 'error', message: 'Update profile failed' };
      }
    } else {
      return { status: 'error', message: validation };
    }
  }
}
