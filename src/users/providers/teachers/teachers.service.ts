import { Injectable } from '@nestjs/common';
import { FindOneTeacherByIdProvider } from './find-one-teacher-by-id.provider';
import { CreateTeacherProvider } from './create-teacher.provider';
import { CreateTeacherDto } from 'src/users/dtos/teachers/create-teacher.dto';
import { FindOneTeacherByRegistrationNumberProvider } from './find-one-teacher-by-registration-number.provider';
import { SoftDeleteTeacherByIdProvider } from './soft-delete-teacher-by-id.provider';
import { DeleteTeacherByIdProvider } from './delete-teacher-by-id.provider';
import { FindMultipleTeachersByIdProvider } from './find-multiple-teachers-by-id.provider';
import { FindOneTeacherByEmailProvider } from './find-one-teacher-by-email.provider';
import { FindOneTeacherByGoogleIdProvider } from './find-one-teacher-by-google-id.provider';
import { CreateGoogleTeacherProvider } from './create-google-teacher.provider';
import { GoogleTeacher } from 'src/users/interfaces/google-teacher.interface';
import { GetUserParamDto } from 'src/users/dtos/users/get-users-param.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { FindAllTeachersProvider } from './find-all-teachers.provider';
import { FindOneTeacherByCpfProvider } from './find-one-teacher-by-cpf.provider';
import { UpdateTeacherProvider } from './update-teacher.provider';
import { PatchTeacherDto } from 'src/users/dtos/teachers/patch-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    private readonly createGoogleTeacherProvider: CreateGoogleTeacherProvider,

    private readonly createTeacherProvider: CreateTeacherProvider,

    private readonly deleteTeacherByIdProvider: DeleteTeacherByIdProvider,

    private readonly findAllTeachersProvider: FindAllTeachersProvider,

    private readonly findMultipleTeachersByIdProvider: FindMultipleTeachersByIdProvider,

    private readonly findOneTeacherByCpfProvider: FindOneTeacherByCpfProvider,

    private readonly findOneTeacherByEmailProvider: FindOneTeacherByEmailProvider,

    private readonly findOneTeacherByGoogleIdProvider: FindOneTeacherByGoogleIdProvider,

    private readonly findOneTeacherByRegistrationNumberProvider: FindOneTeacherByRegistrationNumberProvider,

    private readonly findOneTeacherByIdProvider: FindOneTeacherByIdProvider,

    private readonly softDeleteTeacherByIdProvider: SoftDeleteTeacherByIdProvider,

    private readonly updateTeacherProvider: UpdateTeacherProvider,
  ) {}

  public async createGoogleTeacher(googleTeacher: GoogleTeacher) {
    return await this.createGoogleTeacherProvider.createGoogleTeacher(
      googleTeacher,
    );
  }

  public async createTeacher(createTeacherDto: CreateTeacherDto) {
    return await this.createTeacherProvider.createTeacher(createTeacherDto);
  }

  public findTeachers(
    getUserParamDto: GetUserParamDto,
    paginationQueryDto: PaginationQueryDto,
  ) {
    if (getUserParamDto?.id) {
      return this.findOneTeacherByIdProvider.findOneTeacherById(
        getUserParamDto.id,
      );
    } else {
      return this.findAllTeachersProvider.findAllTeachers(paginationQueryDto);
    }
  }

  public async findMultipleTeachersById(teachersIds: number[]) {
    return await this.findMultipleTeachersByIdProvider.findMultipleTeachersById(
      teachersIds,
    );
  }

  public async findOneTeacherByCpf(teacherCpf: string) {
    return await this.findOneTeacherByCpfProvider.findOneTeacherByCpf(
      teacherCpf,
    );
  }

  public async findOneTeacherByEmail(teacherEmail: string) {
    return await this.findOneTeacherByEmailProvider.findOneTeacherByEmail(
      teacherEmail,
    );
  }

  public async findOneTeacherByGoogleId(googleId: string) {
    return await this.findOneTeacherByGoogleIdProvider.findOneTeacherByGoogleId(
      googleId,
    );
  }

  public async findOneTeacherById(teacherId: number) {
    return await this.findOneTeacherByIdProvider.findOneTeacherById(teacherId);
  }

  public async findOneTeacherByRegistrationNumber(
    teacherRegistrationNumber: number,
  ) {
    return await this.findOneTeacherByRegistrationNumberProvider.findOneTeacherByRegistrationNumber(
      teacherRegistrationNumber,
    );
  }

  public async deleteTeacherById(teacherId: number) {
    return await this.deleteTeacherByIdProvider.deleteTeacher(teacherId);
  }

  public async softDeleteTeacherById(teacherId: number) {
    return await this.softDeleteTeacherByIdProvider.softDeleteTeacher(
      teacherId,
    );
  }

  public async updateTeacher(patchTeacherDto: PatchTeacherDto) {
    return await this.updateTeacherProvider.updateTeacher(patchTeacherDto);
  }
}
