import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTeacherDto } from './create-teacher.dto';

export class PatchTeacherDto extends PartialType(CreateTeacherDto) {
  @ApiProperty({
    description: "The teacher's ID that needs to be updated",
    example: '1',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
