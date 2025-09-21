import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateDisciplineDto } from './create-discipline.dto';

export class PatchDisciplineDTO extends PartialType(CreateDisciplineDto) {
  @ApiProperty({
    description: 'This is the id of the discipline that needs to be updated',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiPropertyOptional({
    description:
      "This is the new teacher's email of the discipline that needs to be updated",
    example: 'Jana@email.com',
  })
  @IsEmail()
  @IsOptional()
  teacherEmail?: string;
}
