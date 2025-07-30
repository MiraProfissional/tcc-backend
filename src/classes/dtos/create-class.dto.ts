import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClassDto {
  @ApiProperty({
    description: 'This is the name of the class',
    example: 'Gerência de Projetos de Software',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  name: string;

  @ApiProperty({
    description: 'This is the code of the class',
    example: 'SDES06',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(24)
  code: string;

  @ApiProperty({
    description: 'This is the semester of class',
    example: '2025.1',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(24)
  semester: string;

  @ApiProperty({
    description: 'This is the day and time of the class',
    example: "['5N34', '6N12']",
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  classTime: string[];

  @ApiProperty({
    description: 'This is the code of the classroom',
    example: 'C1113',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(24)
  classRoom: string;

  @ApiProperty({
    description: "This is the camera's ip responsible to capture the students",
    example: '192.168.1.101',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(24)
  ipCamera: string;
}
