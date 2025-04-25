import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Matches,
  IsISO8601,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  password: string;

  @IsISO8601()
  @IsNotEmpty()
  dateBirth: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  cpf: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  cellphone: string;

  @IsInt()
  @IsNotEmpty()
  registrationNumber: number;
}
