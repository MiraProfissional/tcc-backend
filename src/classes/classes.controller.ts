import { Controller, Get, Param } from '@nestjs/common';
import { ClassesService } from './providers/classes.service';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get('/{:userId}')
  public getPosts(@Param('userId') userId: string) {
    return this.classesService.findAll(userId);
  }
}
