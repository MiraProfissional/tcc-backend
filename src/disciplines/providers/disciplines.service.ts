import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatchDisciplineDTO } from '../dtos/patch-discipline.dto';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Student } from 'src/users/entities/student.entity';

@Injectable()
export class DisciplinesService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Discipline)
    private disciplineRepository: Repository<Discipline>,
  ) {}

  public async findAll(userId: string) {
    return await this.disciplineRepository.find();
  }

  public async create(createDisciplineDto: CreateDisciplineDto) {
    let teacher: Teacher | null;
    let students: Array<Student> = [];

    teacher = await this.usersService.findOneTeacherById(
      createDisciplineDto.teacher,
    );

    if (!teacher) {
      throw new BadRequestException('Teacher was not found');
    }

    if (createDisciplineDto.students) {
      students = await this.usersService.findMultipleStudents(
        createDisciplineDto.students,
      );
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
