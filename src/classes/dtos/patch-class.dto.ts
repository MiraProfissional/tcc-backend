import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateClassDto } from './create-class.dto';

export class PatchClassDTO extends PartialType(CreateClassDto) {
  @ApiProperty({
    description: 'This is the id of the class that needs to be updated',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
