import { Injectable } from '@nestjs/common';
import { FinanceAccount } from '../../../entities/finance_account.entitiy';
import { Transaction } from '../../../entities/transaction.entity';
import { getConnection, getRepository } from 'typeorm';
@Injectable()
export class FinanceService {
  async getFinanceAccountById(id, userId) {
    const query = await getRepository(FinanceAccount)
      .createQueryBuilder('finance')
      .select('finance.id')
      .addSelect('finance.accountName')
      .addSelect('finance.balance')
      .addSelect('finance.type')
      .addSelect('finance.description')
      .where('finance.id = :id', { id: id })
      .andWhere('finance.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere('finance.user = :user', { user: userId })
      .getOne();
    return query;
  }

  async getFinanceAccountByUserId(userId) {
    const query = await getRepository(FinanceAccount)
      .createQueryBuilder('finance')
      .select('finance.id')
      .addSelect('finance.accountName')
      .addSelect('finance.balance')
      .addSelect('finance.type')
      .addSelect('finance.description')
      .where('finance.user = :user', { user: userId })
      .andWhere('finance.isDeleted = :isDeleted', { isDeleted: 0 })
      .getMany();
    return query;
  }

  async createFinanceAccount(body) {
    try {
      const query = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(FinanceAccount)
        .values(body)
        .execute();

      if (query.raw.affectedRows > 0) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  async updateFinanceAccount(body) {
    try {
      const query = await getConnection()
        .createQueryBuilder()
        .update(FinanceAccount)
        .set(body)
        .where('id = :id', { id: body.id })
        .execute();

      if (query.raw.affectedRows > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async getTransactionById(id, userId) {
    const query = await getRepository(Transaction)
      .createQueryBuilder('transaction')
      .select('transaction.amount')
      .addSelect('transaction.transactionName')
      .addSelect('transaction.financeAccount')
      .addSelect('transaction.type')
      .where('transaction.id = :id', { id: id })
      .andWhere('transaction.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere('transaction.user = :user', {
        user: userId,
      })
      .getRawOne();
    return query;
  }

  async getTransactionByFinanceAccount(
    financeAccount,
    userId,
    offset: number,
    limit: number,
  ) {
    const query = await getRepository(Transaction)
      .createQueryBuilder('transaction')
      .select('transaction.id')
      .addSelect('transaction.transactionName')
      .addSelect('transaction.amount')
      .addSelect('transaction.description')
      .addSelect('transaction.type')
      .addSelect('transaction.createdAt')
      .addSelect('transaction.updatedAt')
      .where('transaction.user = :user', { user: userId })
      .andWhere('transaction.financeAccount = :financeAccount', {
        financeAccount: financeAccount,
      })
      .andWhere('transaction.isDeleted = :isDeleted', { isDeleted: 0 })
      .skip(offset)
      .take(limit)
      .getMany();
    return query;
  }

  async getSummaryTransactionMonthly(financeAccount, userId) {
    const query = await getRepository(Transaction)
      .createQueryBuilder('transaction')
      .select('EXTRACT(month FROM transaction.createdAt)', 'month')
      .addSelect('transaction.type', 'type')
      .addSelect('SUM(transaction.amount)', 'sum')
      .where('transaction.user = :user', { user: userId })
      .andWhere('transaction.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere('transaction.financeAccount = :financeAccount', {
        financeAccount: financeAccount,
      })
      .groupBy('transaction.type')
      .addGroupBy('transaction.financeAccount')
      .addGroupBy('extract(year FROM transaction.createdAt)')
      .addGroupBy('extract(month FROM transaction.createdAt)')
      .getRawMany();
    return query;
  }

  async getSummaryTransaction(financeAccount, userId) {
    const query = await getRepository(Transaction)
      .createQueryBuilder('transaction')
      .select('transaction.type', 'type')
      .addSelect('SUM(transaction.amount)', 'sum')
      .where('transaction.user = :user', { user: userId })
      .andWhere('transaction.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere('transaction.financeAccount = :financeAccount', {
        financeAccount: financeAccount,
      })
      .groupBy('transaction.type')
      .addGroupBy('transaction.financeAccount')
      .getRawMany();
    return query;
  }

  async deleteFinanceAccount(id, userId) {
    const query = await getConnection()
      .createQueryBuilder()
      .update(FinanceAccount)
      .where('id = :id', { id: id })
      .set({ isDeleted: true })
      .andWhere('user = :user', { user: userId })
      .execute();
    if (query.raw.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  }

  async createTransaction(body) {
    try {
      const query = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Transaction)
        .values(body)
        .execute();

      if (query.raw.affectedRows > 0) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  async updateTransaction(body) {
    const query = await getConnection()
      .createQueryBuilder()
      .update(Transaction)
      .set(body)
      .where('id = :id', { id: body.id })
      .execute();

    if (query.raw.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  }

  async deleteTransaction(id, userId) {
    const query = await getConnection()
      .createQueryBuilder()
      .update(Transaction)
      .where('id = :id', { id: id })
      .set({ isDeleted: true })
      .andWhere('user = :user', { user: userId })
      .execute();
    if (query.raw.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  }
}
