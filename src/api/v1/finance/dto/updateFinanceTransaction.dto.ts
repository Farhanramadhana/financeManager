import { ApiProperty } from '@nestjs/swagger';

export class UpdateFinanceTransactionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  transactionName?: string;

  @ApiProperty()
  amount?: number;

  @ApiProperty()
  type?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  financeAccount?: string;

  @ApiProperty()
  user?: string;
}
