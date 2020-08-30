import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Auth } from '../../../entities/auth.entity';
import { getConnection } from 'typeorm';

const bcrypt = require('bcryptjs');
const ip = require('ip');
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async hashing(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async checkPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async register(body) {
    const hash = await this.hashing(body.password);
    body.password = hash;
    const createUser = await this.userService.createUser(body);
    if (createUser) {
      return true;
    } else {
      return false;
    }
  }

  async login(username, password) {
    try {
      const data = await this.userService.getUserByEmail(username);

      if (data != null) {
        const hash: string = data.password;
        const checkPassword = await this.checkPassword(password, hash);

        if (checkPassword) {
          const payload = { sub: data.id };
          const token = this.jwtService.sign(payload);
          const authData = {
            ipAddress: ip.address(),
            authMethod: 'api',
            token: token,
            user: data.id,
          };
          this.createAuthLog(authData);
          return token;
        }
      }
    } catch (error) {
      return false;
    }
  }

  async createAuthLog(body) {
    const create = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Auth)
      .values(body)
      .execute();

    if (create.raw.affectedRows > 0) {
      return true;
    }
  }
}
