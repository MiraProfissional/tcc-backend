import { Inject, Injectable } from '@nestjs/common';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';
import { ConfigType } from '@nestjs/config';
import cameraApiConfig from '../config/cameraApi.config';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { CreateDisciplineProvider } from './create-discipline.provider';
import { FindAllDisciplinesProvider } from './find-all-disciplines.provider';

@Injectable()
export class DisciplinesService {
  constructor(
    private readonly createDisciplineProvider: CreateDisciplineProvider,

    private readonly findAllDisciplinesProvider: FindAllDisciplinesProvider,

    @Inject(cameraApiConfig.KEY)
    private readonly cameraApiConfiguration: ConfigType<typeof cameraApiConfig>,
  ) {}

  public async findAllDisciplines(paginationQueryDto: PaginationQueryDto) {
    return await this.findAllDisciplinesProvider.findAllDisiplines(
      paginationQueryDto,
    );
  }

  public async createDiscipline(createDisciplineDto: CreateDisciplineDto) {
    return await this.createDisciplineProvider.createDiscipline(
      createDisciplineDto,
    );
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
