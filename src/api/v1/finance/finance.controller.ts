import {
  Controller,
  Post,
  Get,
  Put,
  Request,
  UseGuards,
  Param,
  Delete,
  Body,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceSchema } from '../../../schema/finance.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ParamIdDto } from './dto/paramId.dto';
import { CreateFinanceAccountDto } from './dto/createFinanceAccount.dto';
import { UpdateFinanceAccountDto } from './dto/updateFinanceAccount.dto';
import { getAllTransactionDto } from './dto/getAllTransaction.dto';
import { getFinanceTransactionDto } from './dto/getFinanceTransaction.dto';
import { CreateFinanceTransactionDto } from './dto/createFinanceTransaction.dto';
import { UpdateFinanceTransactionDto } from './dto/updateFinanceTransaction.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v1/finance')
export class FinanceController {
  constructor(
    private financeService: FinanceService,
    private financeSchema: FinanceSchema,
  ) {}

  @Get('account/all')
  async getFinanceAccountByUserId(@Request() req) {
    const data = await this.financeService.getFinanceAccountByUserId(req.user);
    if (data) {
      return { status: 'success', data };
    } else {
      return { status: 'error', message: 'Get All finance account failed' };
    }
  }

  @Get('account/:id')
  async getFinanceAccountById(@Request() req, @Param() param: ParamIdDto) {
    const data = await this.financeService.getFinanceAccountById(
      param.id,
      req.user,
    );
    if (data) {
      return { status: 'success', data };
    } else {
      return {
        status: 'error',
        message: `Get finance account with id ${param.id} failed`,
      };
    }
  }

  @Post('account/create')
  async createFinanceAccount(
    @Request() req,
    @Body() body: CreateFinanceAccountDto,
  ) {
    body.user = req.user;
    const validation = await this.financeSchema.createFinanceAccountSchema(
      body,
    );

    if (validation) {
      const data = await this.financeService.createFinanceAccount(body);
      if (data) {
        return { status: 'success' };
      } else {
        return { status: 'error', message: 'Create finance account failed' };
      }
    } else {
      return { status: 'error', message: validation };
    }
  }

  @Put('account/update')
  async updateFinanceAccount(
    @Request() req,
    @Body() body: UpdateFinanceAccountDto,
  ) {
    const validation = await this.financeSchema.updateFinanceAccountSchema(
      body,
    );

    if (validation) {
      const update = await this.financeService.updateFinanceAccount(body);

      if (update) {
        const data = await this.financeService.getFinanceAccountById(
          body.id,
          req.user,
        );
        return { status: 'success', data };
      } else {
        return { status: 'error', message: 'Update finance acount failed' };
      }
    } else {
      return { status: 'error', message: validation };
    }
  }

  @Delete('account/:id')
  async deleteFinanceAccount(@Request() req, @Param() param: ParamIdDto) {
    const data = await this.financeService.deleteFinanceAccount(
      param.id,
      req.user,
    );
    if (data) {
      return { status: 'success' };
    } else {
      return {
        status: 'error',
        message: `Delete finance account with id ${param.id} failed`,
      };
    }
  }

  @Get('transaction/all/:offset?/:limit?')
  async getFinanceTransactionByUserId(
    @Request() req,
    @Param() param: getAllTransactionDto,
  ) {
    const financeAccounts = await this.financeService.getFinanceAccountByUserId(
      req.user,
    );

    if (financeAccounts.length == 0) {
      return { status: 'error', message: 'unknown finance account' };
    }

    const transactions = {};

    for (const financeAccount of financeAccounts) {
      const transaction = await this.financeService.getTransactionByFinanceAccount(
        financeAccount.id,
        req.user,
        param.offset,
        param.limit,
      );

      transactions[financeAccount.id] = transaction;
    }

    return { status: 'success', data: transactions };
  }

  @Get('transaction/summary/:period')
  async getFinanceTransaction(
    @Request() req,
    @Param() param: getFinanceTransactionDto,
  ) {
    const financeAccounts = await this.financeService.getFinanceAccountByUserId(
      req.user,
    );

    if (financeAccounts.length == 0) {
      return { status: 'error', message: 'unknown finance account' };
    }

    const transactions = {};

    if (param.period != 'monthly' && param.period != 'all') {
      return { status: 'error', message: 'invalid endpoint' };
    }

    if (param.period == 'monthly') {
      for (const financeAccount of financeAccounts) {
        const transaction = await this.financeService.getSummaryTransactionMonthly(
          financeAccount.id,
          req.user,
        );

        transactions[financeAccount.id] = transaction;
      }
    } else if (param.period == 'all') {
      for (const financeAccount of financeAccounts) {
        const transaction = await this.financeService.getSummaryTransaction(
          financeAccount.id,
          req.user,
        );
        transactions[financeAccount.id] = transaction;
      }
    }
    return { status: 'success', data: transactions };
  }

  @Post('transaction')
  async createFinanceTransaction(
    @Request() req,
    @Body() body: CreateFinanceTransactionDto,
  ) {
    body.user = req.user;

    const validation = await this.financeSchema.createFinanceTransactionSchema(
      body,
    );

    if (validation != true) {
      return { status: 'error', message: validation };
    }

    const financeAccount = await this.financeService.getFinanceAccountById(
      body.financeAccount,
      req.user,
    );

    if (!financeAccount) {
      return {
        status: 'error',
        message: 'Create finance transaction failed, Your account invalid',
      };
    }

    let balanceRemain;
    if (body.type === 'outcome') {
      if (financeAccount.balance < body.amount) {
        return {
          status: 'error',
          message: 'Create finance transaction failed, insufficient balance',
        };
      }
      balanceRemain = financeAccount.balance - body.amount;
    } else {
      balanceRemain = financeAccount.balance + body.amount;
    }

    await this.financeService.createTransaction(body);
    const updateBalance = {
      id: financeAccount.id,
      balance: balanceRemain,
    };
    await this.financeService.updateFinanceAccount(updateBalance);
    return { status: 'success' };
  }

  @Put('transaction/update')
  async updateFinanceTransaction(
    @Request() req,
    @Body() body: UpdateFinanceTransactionDto,
  ) {
    const validation = await this.financeSchema.updateFinanceAccountSchema(
      body,
    );

    if (validation) {
      const updateTransaction = await this.financeService.updateTransaction(
        body,
      );

      if (!updateTransaction) {
        return { status: 'error', message: 'Update transaction error' };
      }

      const getTransaction = await this.financeService.getTransactionById(
        body.id,
        req.user,
      );

      let updateBalance;
      if (getTransaction) {
        const financeAccount = await this.financeService.getFinanceAccountById(
          getTransaction.financeAccountId,
          req.user,
        );
        if (getTransaction.transaction_type == 'income') {
          updateBalance =
            financeAccount.balance + getTransaction.transaction_amount;
        } else {
          updateBalance =
            financeAccount.balance - getTransaction.transaction_amount;
        }

        const body = {
          id: financeAccount.id,
          balance: updateBalance,
        };
        await this.financeService.updateFinanceAccount(body);
        const data = getTransaction;
        return { status: 'success' };
      }
    } else {
      return { status: 'error', message: validation };
    }
  }

  @Delete('transaction/:id')
  async deleteFinanceTransaction(@Request() req, @Param() param: ParamIdDto) {
    const getTransaction = await this.financeService.getTransactionById(
      param.id,
      req.user,
    );

    if (getTransaction) {
      const financeAccount = await this.financeService.getFinanceAccountById(
        getTransaction.financeAccountId,
        req.user,
      );

      let updateBalance;
      if (getTransaction.transaction_type == 'income') {
        updateBalance =
          financeAccount.balance - getTransaction.transaction_amount;
      } else {
        updateBalance =
          financeAccount.balance + getTransaction.transaction_amount;
      }
      const body = {
        id: financeAccount.id,
        balance: updateBalance,
      };
      await this.financeService.updateFinanceAccount(body);
      const deleted = await this.financeService.deleteTransaction(
        param.id,
        req.user,
      );

      if (deleted) {
        return { status: 'success' };
      } else {
        return { status: 'error', message: 'failed to deleted transaction' };
      }
    } else {
      return { status: 'error', message: 'failed to deleted transaction' };
    }
  }
}
