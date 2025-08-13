import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatchDisciplineDTO } from '../dtos/patch-discipline.dto';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';

@Injectable()
export class DisciplinesService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Discipline)
    private disciplineRepository: Repository<Discipline>,
  ) {}

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user: user,
        name: 'Teste 1',
        code: 1,
      },
      {
        user: user,
        name: 'Teste 2',
        code: 2,
      },
    ];
  }

  public async create(createDisciplineDto: CreateDisciplineDto) {

    const newdiscipline = this.disciplineRepository.create(createDisciplineDto);
    return await this.disciplineRepository.save(newdiscipline);
  }

  public async update(patchDisciplineDto: PatchDisciplineDTO) {
    if (patchDisciplineDto.students) {
      const users = await this.usersService.findMutipleUsers(
        patchDisciplineDto.students,
      );
    }

    const discipline = await this.disciplineRepository.findOneBy({
      id: patchDisciplineDto.id,
    });

    discipline.name = patchDisciplineDto.name ?? discipline.name;
    discipline.code = patchDisciplineDto.code ?? discipline.code;
    discipline.semester = patchDisciplineDto.semester ?? discipline.semester;
    discipline.disciplineTime = patchDisciplineDto.disciplineTime ?? discipline.disciplineTime;
    discipline?.disciplineRoom = patchDisciplineDto?.disciplineRoom ?? discipline?.disciplineRoom;
    discipline?.ipCamera = patchDisciplineDto?.ipCamera ?? discipline?.ipCamera;

    if (patchDisciplineDto.students) {
      discipline.students = discipline.students.append(patchDisciplineDto.students);
    }

    return await this.disciplineRepository.save(discipline);
  }
}
