import { Injectable } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { getConnection, getRepository } from 'typeorm';
const bcrypt = require('bcryptjs');
@Injectable()
export class UserService {
  async createUser(body) {
    try {
      const query = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(body)
        .execute();

      if (query.raw.affectedRows > 0) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  async getUserByEmail(email) {
    const query = await getRepository(User)
      .createQueryBuilder('user')
      .select('user.password')
      .addSelect('user.id')
      .where('user.email = :email', { email: email })
      .getOne();
    return query;
  }

  async getUserById(id) {
    const data = await getRepository(User)
      .createQueryBuilder('user')
      .select('user.fullName')
      .addSelect('user.email')
      .addSelect('user.address')
      .where('user.id = :id', { id: id })
      .getOne();
    return data;
  }

  async updateUser(body, id) {
    if (body.password) {
      const saltRounds = 10;
      const hash = await bcrypt.hash(body.password, saltRounds);
      body.password = hash;
    }

    const query = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set(body)
      .where('id = :id', { id: id })
      .execute();

    if (query.raw.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  }
}
