import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Student } from 'src/users/entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllStudentsProvider {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAllStudents(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Student>> {
    let students: Paginated<Student> | undefined;

    try {
      students = await this.paginationProvider.paginateQuery(
        {
          limit: paginationQueryDto.limit,
          page: paginationQueryDto.page,
        },
        this.studentsRepository,
      );
    } catch (error) {
      throw new Error(`Error finding disciplines: ${error}`);
    }

    if (!students) {
      throw new Error('No disciplines found');
    }

    return students;
  }
}
