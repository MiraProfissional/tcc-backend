import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DisciplinesService } from './providers/disciplines.service';
import { CreateDisciplineDto } from './dtos/create-discipline.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchDisciplineDTO } from './dtos/patch-discipline.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

@Controller('disciplines')
@ApiTags('Disciplines')
export class DisciplinesController {
  constructor(private readonly disciplinesService: DisciplinesService) {}

  @Get('/{:userId}')
  public getPosts(
    @Param('userId') userId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.disciplinesService.findAllDisciplines(paginationQueryDto);
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
    return this.disciplinesService.createDiscipline(createDisciplineDto);
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
    return this.disciplinesService.updateDiscipline(patchDisciplineDto);
  }
}
