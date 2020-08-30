import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FinanceAccount } from './finance_account.entitiy';
import { Transaction } from './transaction.entity';
import { Auth } from './auth.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  financeAccount: FinanceAccount[];
  transaction: Transaction[];
  auth: Auth[];

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  created_at;

  @UpdateDateColumn()
  updatedAt;
}
