import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { FinanceSchema } from '../../../schema/finance.schema';
import { FinanceAccount } from '../../../entities/finance_account.entitiy';
import { Transaction } from '../../../entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FinanceAccount, Transaction])],
  controllers: [FinanceController],
  providers: [FinanceService, FinanceSchema],
})
export class FinanceModule {}
