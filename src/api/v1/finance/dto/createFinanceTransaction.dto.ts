import { ApiProperty } from '@nestjs/swagger';

export class CreateFinanceTransactionDto {
  @ApiProperty()
  transactionName: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  financeAccount: string;

  @ApiProperty()
  user?: string;
}
