import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClassesService } from './providers/classes.service';
import { CreateClassDto } from './dtos/create-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get('/{:userId}')
  public getPosts(@Param('userId') userId: string) {
    return this.classesService.findAll(userId);
  }

  @Post()
  public postClass(@Body() createClassDto: CreateClassDto) {
    return this.classesService.createClass(createClassDto);
  }
}
