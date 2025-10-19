import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllTeachersProvider {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAllTeachers(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Teacher>> {
    let teachers: Paginated<Teacher> | undefined;

    try {
      teachers = await this.paginationProvider.paginateQuery(
        {
          limit: paginationQueryDto?.limit,
          page: paginationQueryDto.page,
        },
        this.teachersRepository,
      );
    } catch (error) {
      throw new Error(`Error finding teachers: ${error}`);
    }

    if (!teachers) {
      throw new Error('No teachers found');
    }

    return teachers;
  }
}
