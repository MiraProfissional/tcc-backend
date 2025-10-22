import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class GetDisciplineParamDto {
  @ApiPropertyOptional({
    description: 'Get discipline with a specific id',
    example: 123,
  })
  @IsOptional()
  @IsInt()
  disciplineId?: number;
}
