import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class FinanceAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    type => User,
    user => user.financeAccount,
  )
  user: User;

  transaction: Transaction[];

  @Column()
  accountName: string;

  @Column()
  balance: number;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}
