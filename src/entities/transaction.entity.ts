import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './user.entity';
import { FinanceAccount } from './finance_account.entitiy';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transactionName: string;

  @ManyToOne(
    type => User,
    user => user.transaction,
  )
  user: User;

  @ManyToOne(
    type => FinanceAccount,
    financeAccount => financeAccount.transaction,
  )
  financeAccount: FinanceAccount;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}