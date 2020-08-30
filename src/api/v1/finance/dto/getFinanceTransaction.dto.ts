import { ApiProperty } from '@nestjs/swagger';

export class getFinanceTransactionDto {
  @ApiProperty()
  period: string;
}
