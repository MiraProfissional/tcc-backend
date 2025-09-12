import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatchDisciplineDTO } from '../dtos/patch-discipline.dto';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Student } from 'src/users/entities/student.entity';
import { ConfigType } from '@nestjs/config';
import cameraApiConfig from '../config/cameraApi.config';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { StudentsService } from 'src/users/providers/students/students.service';
import { TeachersService } from 'src/users/providers/teachers/teachers.service';

@Injectable()
export class DisciplinesService {
  constructor(
    private readonly studentsService: StudentsService,

    private readonly teachersService: TeachersService,

    @InjectRepository(Discipline)
    private disciplineRepository: Repository<Discipline>,

    private readonly paginationProvider: PaginationProvider,

    @Inject(cameraApiConfig.KEY)
    private readonly cameraApiConfiguration: ConfigType<typeof cameraApiConfig>,
  ) {}

  public async findAll(
    userId: string,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Discipline>> {
    const disciplines = await this.paginationProvider.paginateQuery(
      {
        limit: paginationQueryDto.limit,
        page: paginationQueryDto.page,
      },
      this.disciplineRepository,
    );

    return disciplines;
  }

  public async create(createDisciplineDto: CreateDisciplineDto) {
    let teacher: Teacher | null;
    let students: Array<Student> = [];

    teacher = await this.teachersService.findOneTeacherById(
      createDisciplineDto.teacher,
    );

    if (!teacher) {
      throw new BadRequestException('Teacher was not found');
    }

    if (createDisciplineDto.students) {
      students = await this.studentsService.findMultipleStudentsById(
        createDisciplineDto.students,
      );

      if (students.length != createDisciplineDto.students.length) {
        throw new BadRequestException(
          'Some student does not exist, please check the IDs',
        );
      }
    }

    const disciplineData = {
      ...createDisciplineDto,
      teacher,
      students,
    };

    const newDiscipline = this.disciplineRepository.create(disciplineData);

    return await this.disciplineRepository.save(newDiscipline);
  }

  /* public async update(patchDisciplineDto: PatchDisciplineDTO) {
    if (patchDisciplineDto.students) {
      const users = await this.usersService.findMutipleUsers(
        patchDisciplineDto.students,
      );
    }

    const discipline = await this.disciplineRepository.findOneBy({
      id: patchDisciplineDto.id,
    });

    if (discipline) {
      discipline.name = patchDisciplineDto.name ?? discipline.name;
      discipline.code = patchDisciplineDto.code ?? discipline.code;
      discipline.semester = patchDisciplineDto.semester ?? discipline.semester;
      discipline.disciplineTime =
        patchDisciplineDto.disciplineTime ?? discipline.disciplineTime;
      discipline.disciplineRoom =
        patchDisciplineDto?.disciplineRoom ?? discipline?.disciplineRoom;
      discipline.ipCamera =
        patchDisciplineDto?.ipCamera ?? discipline?.ipCamera;
      if (patchDisciplineDto.students) {
        discipline.students = discipline.students.append(
          patchDisciplineDto.students,
        );
      }
    }

    return await this.disciplineRepository.save(discipline);
  } */
}
