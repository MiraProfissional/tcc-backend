import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DisciplinesService } from './providers/disciplines.service';
import { CreateDisciplineDto } from './dtos/create-discipline.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchDisciplineDTO } from './dtos/patch-discipline.dto';

@Controller('disciplines')
@ApiTags('Disciplines')
export class DisciplinesController {
  constructor(private readonly disciplinesService: DisciplinesService) {}

  @Get('/{:userId}')
  public getPosts(@Param('userId') userId: string) {
    return this.disciplinesService.findAll(userId);
  }

  @ApiOperation({
    summary: 'Creates a new discipline',
  })
  @ApiResponse({
    status: 201,
    description:
      'You get a 201 response if your discipline is created successfully',
  })
  @Post()
  public post(@Body() createDisciplineDto: CreateDisciplineDto) {
    return this.disciplinesService.create(createDisciplineDto);
  }

  @ApiOperation({
    summary: 'Updates an existing discipline',
  })
  @ApiResponse({
    status: 200,
    description:
      'You get a 200 response if your discipline is updated successfully',
  })
  @Patch()
  public patch(@Body() patchDisciplineDto: PatchDisciplineDTO) {
    return 'this.disciplinesService.update(patchDisciplineDto);';
  }
}
