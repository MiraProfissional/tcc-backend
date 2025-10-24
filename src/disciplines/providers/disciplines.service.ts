import { Inject, Injectable } from '@nestjs/common';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';
import { ConfigType } from '@nestjs/config';
import cameraApiConfig from '../config/faceRecognitionApi.config';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { CreateDisciplineProvider } from './create-discipline.provider';
import { FindAllDisciplinesProvider } from './find-all-disciplines.provider';
import { PatchDisciplineDto } from '../dtos/patch-discipline.dto';
import { UpdateDisciplineProvider } from './update-discipline.provider';
import { DeleteDisciplineByIdProvider } from './delete-discipline-by-id.provider';
import { SoftDeleteDisciplineByIdProvider } from './soft-delete-discipline-by-id.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { FindOneDisciplineByIdProvider } from './find-one-discipline-by-id.provider';
import { StartFaceRecognitionProvider } from './start-face-recognition.provider';
import { StopFaceRecognitionProvider } from './stop-face-recognition.provider';
import { FindDisciplinesByUserIdProvider } from './find-disciplines-by-user-id.provider';
import { GetDisciplineParamDto } from '../dtos/get-discipline-param.dto';
import { RemoveStudentsFromDisciplineProvider } from './remove-students-from-discipline.provider';
import { RemoveStudentsDto } from '../dtos/remove-students-from-discipline.dto';

@Injectable()
export class DisciplinesService {
  constructor(
    private readonly createDisciplineProvider: CreateDisciplineProvider,

    private readonly deleteDisciplineByIdProvider: DeleteDisciplineByIdProvider,

    private readonly findAllDisciplinesProvider: FindAllDisciplinesProvider,

    private readonly findOneDisciplineByIdProvider: FindOneDisciplineByIdProvider,

    private readonly updateDisciplineProvider: UpdateDisciplineProvider,

    private readonly softDeleteDisciplineByIdProvider: SoftDeleteDisciplineByIdProvider,

    private readonly startFaceRecognitionProvider: StartFaceRecognitionProvider,

    private readonly stopFaceRecognitionProvider: StopFaceRecognitionProvider,

    private readonly findDisciplinesByUserIdProvider: FindDisciplinesByUserIdProvider,

    private readonly removeStudentsFromDisciplineProvider: RemoveStudentsFromDisciplineProvider,

    @Inject(cameraApiConfig.KEY)
    private readonly cameraApiConfiguration: ConfigType<typeof cameraApiConfig>,
  ) {}

  public async findDisciplines(
    getDisciplineParam: GetDisciplineParamDto,
    paginationQueryDto: PaginationQueryDto,
  ) {
    if (getDisciplineParam?.disciplineId) {
      return await this.findOneDisciplineByIdProvider.findOneDisciplineById(
        getDisciplineParam.disciplineId,
      );
    } else {
      return await this.findAllDisciplinesProvider.findAllDisciplines(
        paginationQueryDto,
      );
    }
  }

  public async createDiscipline(
    createDisciplineDto: CreateDisciplineDto,
    user: ActiveUserData,
  ) {
    return await this.createDisciplineProvider.createDiscipline(
      createDisciplineDto,
      user,
    );
  }

  public async findOneDisciplineById(disciplineId: number) {
    return await this.findOneDisciplineByIdProvider.findOneDisciplineById(
      disciplineId,
    );
  }

  public async updateDiscipline(patchDisciplineDto: PatchDisciplineDto) {
    return await this.updateDisciplineProvider.updateDiscipline(
      patchDisciplineDto,
    );
  }

  public async deleteDisciplineById(disciplineId: number) {
    return await this.deleteDisciplineByIdProvider.deleteDiscipline(
      disciplineId,
    );
  }

  public async softDeleteDisciplineById(disciplineId: number) {
    return await this.softDeleteDisciplineByIdProvider.softDeleteDiscipline(
      disciplineId,
    );
  }

  public findDisciplinesByUserId(
    user: ActiveUserData,
    paginationQueryDto: PaginationQueryDto,
  ) {
    return this.findDisciplinesByUserIdProvider.findDisciplinesByUserId(
      user,
      paginationQueryDto,
    );
  }

  public async startFaceRecognition(disciplineId: number) {
    return await this.startFaceRecognitionProvider.startFaceRecognitionByDisciplineId(
      disciplineId,
    );
  }

  public async stopFaceRecognition(disciplineId: number) {
    return await this.stopFaceRecognitionProvider.stopFaceRecognitionByDisciplineId(
      disciplineId,
    );
  }

  public async removeStudentsFromDiscipline(
    removeStudentsDto: RemoveStudentsDto,
  ) {
    return await this.removeStudentsFromDisciplineProvider.removeStudentsFromDiscipline(
      removeStudentsDto,
    );
  }
}
