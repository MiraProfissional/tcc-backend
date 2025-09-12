import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatchDisciplineDTO } from '../dtos/patch-discipline.dto';
import { StudentsService } from 'src/users/providers/students/students.service';
import { TeachersService } from 'src/users/providers/teachers/teachers.service';

@Injectable()
export class UpdateDisciplineProvider {
  constructor(
    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,

    private readonly teachersService: TeachersService,

    private readonly studentsService: StudentsService,
  ) {}

  public async updateDiscipline(
    patchDisciplineDto: PatchDisciplineDTO,
  ): Promise<Discipline> {
    let discipline: Discipline | null;

    try {
      discipline = await this.disciplinesRepository.findOneBy({
        id: patchDisciplineDto.id,
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!discipline) {
      throw new BadRequestException(
        `Discipline with id: ${patchDisciplineDto.id} was not found, please check your id`,
      );
    }

    if (patchDisciplineDto.students) {
      const newUsers = await this.studentsService.findMultipleStudentsById(
        patchDisciplineDto.students,
      );

      discipline.students = [...(discipline.students ?? []), ...newUsers];
    }

    if (patchDisciplineDto.teacher) {
      const newTeacher = await this.teachersService.findOneTeacherById(
        patchDisciplineDto.teacher,
      );

      discipline.teacher = newTeacher;
    }

    discipline.name = patchDisciplineDto.name ?? discipline.name;
    discipline.code = patchDisciplineDto.code ?? discipline.code;
    discipline.semester = patchDisciplineDto.semester ?? discipline.semester;
    discipline.disciplineTime =
      patchDisciplineDto.disciplineTime ?? discipline.disciplineTime;
    discipline.disciplineRoom =
      patchDisciplineDto?.disciplineRoom ?? discipline?.disciplineRoom;
    discipline.ipCamera = patchDisciplineDto?.ipCamera ?? discipline?.ipCamera;

    try {
      await this.disciplinesRepository.save(discipline);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return discipline;
  }
}
