import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(24)
  code: string;

  @IsInt()
  @IsNotEmpty()
  semester: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  day: string[];

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  endTime: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(24)
  classRoom: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(24)
  ipCamera: string;
}
