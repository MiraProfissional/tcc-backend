import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class RequestFaceRecognitionDto {
  @ApiProperty({
    description:
      'This is the id of the discipline that needs to start or stop the recognition',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
