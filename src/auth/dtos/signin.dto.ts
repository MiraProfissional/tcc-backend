import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: "This is the user's email",
    example: 'joaovitor@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      "This is the user's password. Must have minimum eight characters, at least one letter, one number and one special character ",
    example: '#Joaovitor123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
