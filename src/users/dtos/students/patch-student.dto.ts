import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatchStudentDto extends PartialType(
  OmitType(CreateStudentDto, ['userRole', 'password'] as const),
) {
  @ApiProperty({
    description: "The student's ID that needs to be updated",
    example: '1',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
