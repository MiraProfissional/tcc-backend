import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDisciplineDto {
  @ApiProperty({
    description: 'This is the name of the discipline',
    example: 'Gerência de Projetos de Software',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  name: string;

  @ApiProperty({
    description: 'This is the code of the discipline',
    example: 'SDES06',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(24)
  code: string;

  @ApiProperty({
    description: 'This is the semester of discipline',
    example: '2025.1',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(24)
  semester: string;

  @ApiProperty({
    description: 'This is the day and time of the discipline',
    example: ['5N34', '6N12'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  disciplineTime: string[];

  @ApiProperty({
    description: "This is the code of the discipline's room",
    example: 'C1113',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(24)
  disciplineRoom: string;

  @ApiProperty({
    description: "This is the camera's ip responsible to capture the students",
    example: '192.168.1.101',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(24)
  ipCamera: string;

  @ApiProperty({
    description: 'These are the students IDs of the discipline',
    example: [1, 2],
  })
  @IsInt({ each: true })
  @IsArray()
  @IsOptional()
  students?: number[];
}
