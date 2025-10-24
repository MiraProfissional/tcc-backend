import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Matches,
  IsISO8601,
  IsInt,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/users/enums/user-role.enum';

export class CreateStudentDto {
  @ApiProperty({
    description: "This is the student's first name",
    example: 'Joao Vitor',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  firstName: string;

  @ApiProperty({
    description: "This is the student's last name",
    example: 'Garcia Mira',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  lastName: string;

  @ApiProperty({
    description: "This is the student's email",
    example: 'joaovitor@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @ApiProperty({
    description:
      "This is the student's password. Must have minimum eight characters, at least one letter, one number and one special character ",
    example: '#Joaovitor123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  password: string;

  @ApiProperty({
    description: "This is the student's birthday (ISO8601 format)",
    example: '2001-03-16T07:46:32+00:00',
  })
  @IsISO8601()
  @IsNotEmpty()
  dateBirth: string;

  @ApiProperty({
    description: "This is the student's document (CPF)",
    example: '44455566678',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  cpf: string;

  @ApiProperty({
    description: "This is the student's cellphone",
    example: '12987654321',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  cellphone: string;

  @ApiProperty({
    description: "This is the student's identifier number",
    example: 123456789,
  })
  @IsInt()
  @IsNotEmpty()
  registrationNumber: number;

  @ApiProperty({
    description: "This is the user's role",
    example: 'STUDENT',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  userRole: UserRole;

  @ApiProperty({
    description: "This is the student's course",
    example: 'Ciência da Computação',
  })
  @IsString()
  @IsNotEmpty()
  course: string;
}
