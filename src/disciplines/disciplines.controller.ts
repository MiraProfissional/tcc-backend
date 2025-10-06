import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DisciplinesService } from './providers/disciplines.service';
import { CreateDisciplineDto } from './dtos/create-discipline.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchDisciplineDTO } from './dtos/patch-discipline.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { ActiveUser } from 'src/auth/decorators/active-user-data.decorator';
import { RequestFaceRecognitionDto } from './dtos/request-face-recognition-discipline.dto';

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
  public post(
    @Body() createDisciplineDto: CreateDisciplineDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.disciplinesService.createDiscipline(createDisciplineDto, user);
  }

  @ApiOperation({
    summary: 'Start face recognition of the discipline',
  })
  @ApiResponse({
    status: 200,
    description:
      'You get a 200 response if the camera opened successfully and start the face recognition',
  })
  @Post('/start-face-recognition')
  public startFaceRecognition(
    @Body() requestFaceRecognition: RequestFaceRecognitionDto,
  ) {
    return this.disciplinesService.startFaceRecognition(
      requestFaceRecognition.id,
    );
  }

  @ApiOperation({
    summary: 'Stop face recognition of the discipline',
  })
  @ApiResponse({
    status: 200,
    description:
      'You get a 200 response if the camera closed successfully and stop the face recognition',
  })
  @Post('/stop-face-recognition')
  public stopFaceRecognition(
    @Body() requestFaceRecognition: RequestFaceRecognitionDto,
  ) {
    return this.disciplinesService.stopFaceRecognition(
      requestFaceRecognition.id,
    );
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

  @ApiOperation({
    summary: 'Deletes an existing discipline',
  })
  @ApiResponse({
    status: 200,
    description:
      'You get a 200 response if your discipline is deleted successfully',
  })
  @Delete()
  public deleteDiscipline(@Query('id', ParseIntPipe) id: number) {
    return this.disciplinesService.deleteDisciplineById(id);
  }

  @ApiOperation({
    summary: 'Soft deletes an existing discipline',
  })
  @ApiResponse({
    status: 200,
    description:
      'You get a 200 response if your discipline is soft deleted successfully',
  })
  @Delete('/soft-delete')
  public softDeleteDiscipline(@Query('id', ParseIntPipe) id: number) {
    return this.disciplinesService.softDeleteDisciplineById(id);
  }
}
