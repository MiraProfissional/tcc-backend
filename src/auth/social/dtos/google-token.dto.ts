import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/users/enums/user-role.enum';

export class GoogleTokenDto {
  @IsNotEmpty()
  googleToken: string;

  @ApiProperty({
    description: "This is the user's birthday (ISO8601 format)",
    example: '2001-03-16T07:46:32+00:00',
  })
  @IsISO8601()
  @IsNotEmpty()
  dateBirth: string;

  @ApiProperty({
    description: "This is the user's document (CPF)",
    example: '44455566678',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  cpf: string;

  @ApiProperty({
    description: "This is the user's cellphone",
    example: '12987654321',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  cellphone: string;

  @ApiProperty({
    description: "This is the user's identifier number",
    example: 123456789,
  })
  @IsInt()
  @IsNotEmpty()
  registrationNumber: number;

  @ApiProperty({
    description: "This is the user's role",
    example: 'TEACHER',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  userRole: UserRole;

  @IsString()
  @IsOptional()
  course?: string;
}
