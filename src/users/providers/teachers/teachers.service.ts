import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindOneTeacherByIdProvider } from './find-one-teacher-by-id.provider';
import { CreateTeacherProvider } from './create-teacher.provider';
import { CreateTeacherDto } from 'src/users/dtos/teachers/create-teacher.dto';
import { FindOneTeacherByRegistrationNumberProvider } from './find-one-teacher-by-registration-number.provider';
import { SoftDeleteTeacherByIdProvider } from './soft-delete-teacher-by-id.provider';
import { DeleteTeacherByIdProvider } from './delete-teacher-by-id.provider';
import { FindMultipleTeachersByIdProvider } from './find-multiple-teachers-by-id.provider';
import { AuthService } from 'src/auth/providers/auth.service';

@Injectable()
export class TeachersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    private readonly createTeacherProvider: CreateTeacherProvider,

    private readonly deleteTeacherByIdProvider: DeleteTeacherByIdProvider,

    private readonly findMultipleTeachersByIdProvider: FindMultipleTeachersByIdProvider,

    private readonly findOneTeacherByRegistrationNumberProvider: FindOneTeacherByRegistrationNumberProvider,

    private readonly findOneTeacherByIdProvider: FindOneTeacherByIdProvider,

    private readonly softDeleteTeacherByIdProvider: SoftDeleteTeacherByIdProvider,
  ) {}

  public async createTeacher(createTeacherDto: CreateTeacherDto) {
    return await this.createTeacherProvider.createTeacher(createTeacherDto);
  }

  public findAll() {
    return 'Find all method';
  }

  public async findMultipleTeachersById(teachersIds: number[]) {
    return await this.findMultipleTeachersByIdProvider.findMultipleTeachersById(
      teachersIds,
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
}
