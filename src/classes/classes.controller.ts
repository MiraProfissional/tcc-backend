import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ClassesService } from './providers/classes.service';
import { CreateClassDto } from './dtos/create-class.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchClassDTO } from './dtos/patch-class.dto';

@Controller('classes')
@ApiTags('Classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get('/{:userId}')
  public getPosts(@Param('userId') userId: string) {
    return this.classesService.findAll(userId);
  }

  @ApiOperation({
    summary: 'Creates a new class',
  })
  @ApiResponse({
    status: 201,
    description:
      'You get a 201 response if your class is created  successfully',
  })
  @Post()
  public postClass(@Body() createClassDto: CreateClassDto) {
    return this.classesService.createClass(createClassDto);
  }

  @ApiOperation({
    summary: 'Updates an existing class',
  })
  @ApiResponse({
    status: 200,
    description: 'You get a 200 response if your class is updated successfully',
  })
  @Patch()
  public patchClass(@Body() patchClassDto: PatchClassDTO) {
    console.log(patchClassDto);
    return 'Deu bom';
  }
}
