import { ApiProperty } from '@nestjs/swagger';

export class UpdateFinanceAccountDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accountName?: string;

  @ApiProperty()
  balance?: number;

  @ApiProperty()
  type?: string;

  @ApiProperty()
  description?: string;

  user?: string;
}
