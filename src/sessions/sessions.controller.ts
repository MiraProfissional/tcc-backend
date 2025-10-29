import { Controller, Get, Param } from '@nestjs/common';
import { SessionsService } from './providers/sessions.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAllSessionsByDisciplineIdDto } from './dtos/get-all-sessions-by-discipline-id.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}
  @ApiOperation({
    summary: 'Fetches disciplines related to the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Disciplines for the authenticated user',
  })
  @Get('/attrelated-discipline/:disciplineId')
  public getByUser(
    @Param() getAllSessionsByDisciplineIdDto: GetAllSessionsByDisciplineIdDto,
  ) {
    return this.sessionsService.findSessionsByDisciplineId(
      getAllSessionsByDisciplineIdDto.disciplineId,
    );
  }
}
