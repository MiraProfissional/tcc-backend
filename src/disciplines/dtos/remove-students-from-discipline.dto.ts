import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsArray } from 'class-validator';

export class RemoveStudentsDto {
  @ApiProperty({
    description: 'The ID of the discipline from which students will be removed',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'Array of student IDs to remove from the discipline',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNotEmpty()
  studentsIds: number[];
}
