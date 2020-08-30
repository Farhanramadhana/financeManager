import { ApiProperty } from '@nestjs/swagger';

export class CreateFinanceAccountDto {
  @ApiProperty()
  accountName: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  user?: string;
}
