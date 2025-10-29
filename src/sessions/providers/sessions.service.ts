import { Injectable } from '@nestjs/common';
import { CreateSessionProvider } from './create-session.provider';
import { CreateSessionInterface } from '../interfaces/create-session.interface';
import { FindAllSessionsProvider } from './find-all-sessions.provider';

import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { FindAllSessionsByDisciplineProvider } from './find-all-sessions-by-discipline.provider';

@Injectable()
export class SessionsService {
  constructor(
    private readonly createSessionProvider: CreateSessionProvider,
    private readonly findAllSessionsProvider: FindAllSessionsProvider,
    private readonly findAllSessionsByDisciplineProvider: FindAllSessionsByDisciplineProvider,
  ) {}

  public async createSession(createSessionParam: CreateSessionInterface) {
    return await this.createSessionProvider.createSession(createSessionParam);
  }

  public async findAllSessions(paginationQueryDto: PaginationQueryDto) {
    return await this.findAllSessionsProvider.findAllSessions(
      paginationQueryDto,
    );
  }

  public async findSessionsByDisciplineId(disciplineId: number) {
    return await this.findAllSessionsByDisciplineProvider.findAllSessionsByDisciplineId(
      disciplineId,
    );
  }
}
