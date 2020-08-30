import { ApiProperty } from '@nestjs/swagger';

export class getAllTransactionDto {
  @ApiProperty()
  offset?: number;

  @ApiProperty()
  limit?: number;
}
