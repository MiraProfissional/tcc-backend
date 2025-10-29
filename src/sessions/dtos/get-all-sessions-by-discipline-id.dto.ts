import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetAllSessionsByDisciplineIdDto {
  @ApiPropertyOptional({
    description: 'Get sessions attrelated to a specific discipline id',
    example: 123,
  })
  @IsNotEmpty()
  @IsInt()
  disciplineId: number;
}
