import { Inject, Injectable } from '@nestjs/common';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';
import { ConfigType } from '@nestjs/config';
import cameraApiConfig from '../config/cameraApi.config';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { CreateDisciplineProvider } from './create-discipline.provider';
import { FindAllDisciplinesProvider } from './find-all-disciplines.provider';
import { PatchDisciplineDTO } from '../dtos/patch-discipline.dto';
import { UpdateDisciplineProvider } from './update-discipline.provider';

@Injectable()
export class DisciplinesService {
  constructor(
    private readonly createDisciplineProvider: CreateDisciplineProvider,

    private readonly findAllDisciplinesProvider: FindAllDisciplinesProvider,

    private readonly updateDisciplineProvider: UpdateDisciplineProvider,

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

  public async updateDiscipline(patchDisciplineDto: PatchDisciplineDTO) {
    return await this.updateDisciplineProvider.updateDiscipline(
      patchDisciplineDto,
    );
  }
}
