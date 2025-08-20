import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from '../users/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto extends CreateUserDto {
  @ApiProperty({
    description: "This is the student's course",
    example: 'Ciência da Computação',
  })
  @IsString()
  @IsNotEmpty()
  course: string;
}
