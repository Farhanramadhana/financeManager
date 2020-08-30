import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from '../../../schema/user.schema';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserSchema],
})
export class UserModule {}
