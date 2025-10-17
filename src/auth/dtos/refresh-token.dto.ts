import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: "This is the user's refresh token",
    example: 'some-refresh-token',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
