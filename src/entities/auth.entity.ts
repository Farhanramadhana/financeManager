import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => User,
    user => user.auth,
  )
  user: User;

  @Column()
  ipAddress: string;

  @Column()
  authMethod: string;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}
