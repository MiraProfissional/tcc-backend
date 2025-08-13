import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateDisciplineDto } from './create-discipline.dto';

export class PatchDisciplineDTO extends PartialType(CreateDisciplineDto) {
  @ApiProperty({
    description: 'This is the id of the discipline that needs to be updated',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
