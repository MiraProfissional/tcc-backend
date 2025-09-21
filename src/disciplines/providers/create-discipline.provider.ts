import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';
import { StudentsService } from 'src/users/providers/students/students.service';
import { TeachersService } from 'src/users/providers/teachers/teachers.service';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Student } from 'src/users/entities/student.entity';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class CreateDisciplineProvider {
  constructor(
    @InjectRepository(Discipline)
    private disciplineRepository: Repository<Discipline>,

    private readonly studentsService: StudentsService,

    private readonly teachersService: TeachersService,
  ) {}

  public async createDiscipline(
    createDisciplineDto: CreateDisciplineDto,
    user: ActiveUserData,
  ) {
    let students: Array<Student> = [];

    const teacher: Teacher = await this.teachersService.findOneTeacherById(
      user.sub,
    );

    if (createDisciplineDto.students) {
      students = await this.studentsService.findMultipleStudentsById(
        createDisciplineDto.students,
      );

      if (students.length != createDisciplineDto.students.length) {
        throw new BadRequestException('Please check de students IDs');
      }
    }

    const disciplineData = {
      ...createDisciplineDto,
      teacher,
      students,
    };

    const newDiscipline = this.disciplineRepository.create(disciplineData);

    try {
      await this.disciplineRepository.save(newDiscipline);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return newDiscipline;
  }
}
