import { Injectable } from '@nestjs/common';
import { Session } from '../session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

@Injectable()
export class FindAllSessionsProvider {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAllSessions(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Session>> {
    let sessions: Paginated<Session> | undefined;

    try {
      sessions = await this.paginationProvider.paginateQuery(
        {
          limit: paginationQueryDto.limit,
          page: paginationQueryDto.page,
        },
        this.sessionRepository,
      );
    } catch (error) {
      throw new Error(`Error finding sessions: ${error}`);
    }

    if (!sessions) {
      throw new Error('No sessions found');
    }

    return sessions;
  }
}
