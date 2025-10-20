import { Injectable } from '@nestjs/common';
import { Discipline } from '../discipline.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

@Injectable()
export class FindAllDisciplinesProvider {
  constructor(
    @InjectRepository(Discipline)
    private disciplineRepository: Repository<Discipline>,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAllDisciplines(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Discipline>> {
    let disciplines: Paginated<Discipline> | undefined;

    try {
      disciplines = await this.paginationProvider.paginateQuery(
        {
          limit: paginationQueryDto.limit,
          page: paginationQueryDto.page,
        },
        this.disciplineRepository,
      );
    } catch (error) {
      throw new Error(`Error finding disciplines: ${error}`);
    }

    if (!disciplines) {
      throw new Error('No disciplines found');
    }

    return disciplines;
  }
}
