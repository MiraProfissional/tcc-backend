import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { UserRole } from 'src/users/enums/user-role.enum';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class FindDisciplinesByUserIdProvider {
  constructor(
    @InjectRepository(Discipline)
    private disciplineRepository: Repository<Discipline>,
  ) {}

  public async findDisciplinesByUserId(
    user: ActiveUserData,
    paginationQueryDto: PaginationQueryDto,
  ) {
    const userId = user.sub;
    const userRole = user.role;

    const page = paginationQueryDto.page ?? 1;
    const limit = paginationQueryDto.limit ?? 10;

    const disciplines = await this.disciplineRepository.find();

    const userDisciplines = disciplines.filter((discipline) => {
      if (userRole === UserRole.TEACHER) {
        const matched = !!(
          discipline.teacher && discipline.teacher.id === userId
        );
        return matched;
      }

      const students = Array.isArray(discipline.students)
        ? discipline.students
        : [];
      const matched = students.some(
        (student) => !!student && student.id === userId,
      );
      return matched;
    });

    const totalItems = userDisciplines.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const start = (page - 1) * limit;
    const items = userDisciplines.slice(start, start + limit);

    return {
      data: items,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
      },
      links: {
        first: `?limit=${limit}&page=1`,
        last: `?limit=${limit}&page=${totalPages}`,
        current: `?limit=${limit}&page=${page}`,
        next: `?limit=${limit}&page=${page === totalPages ? page : page + 1}`,
        previous: `?limit=${limit}&page=${page === 1 ? page : page - 1}`,
      },
    } as Paginated<Discipline>;
  }
}
