import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  address?: string;
}
