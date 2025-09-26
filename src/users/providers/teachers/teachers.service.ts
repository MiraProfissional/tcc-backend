import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindOneTeacherByIdProvider } from './find-one-teacher-by-id.provider';
import { CreateTeacherProvider } from './create-teacher.provider';
import { CreateTeacherDto } from 'src/users/dtos/teachers/create-teacher.dto';
import { FindOneTeacherByRegistrationNumberProvider } from './find-one-teacher-by-registration-number.provider';
import { SoftDeleteTeacherByIdProvider } from './soft-delete-teacher-by-id.provider';
import { DeleteTeacherByIdProvider } from './delete-teacher-by-id.provider';
import { FindMultipleTeachersByIdProvider } from './find-multiple-teachers-by-id.provider';
import { AuthService } from 'src/auth/providers/auth.service';
import { FindOneTeacherByEmailProvider } from './find-one-teacher-by-email.provider';
import { FindOneTeacherByGoogleIdProvider } from './find-one-teacher-by-google-id.provider';
import { CreateGoogleTeacherProvider } from './create-google-teacher.provider';
import { GoogleTeacher } from 'src/users/interfaces/google-teacher.interface';

@Injectable()
export class TeachersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    private readonly createGoogleTeacherProvider: CreateGoogleTeacherProvider,

    private readonly createTeacherProvider: CreateTeacherProvider,

    private readonly deleteTeacherByIdProvider: DeleteTeacherByIdProvider,

    private readonly findMultipleTeachersByIdProvider: FindMultipleTeachersByIdProvider,

    private readonly findOneTeacherByEmailProvider: FindOneTeacherByEmailProvider,

    private readonly findOneTeacherByGoogleIdProvider: FindOneTeacherByGoogleIdProvider,

    private readonly findOneTeacherByRegistrationNumberProvider: FindOneTeacherByRegistrationNumberProvider,

    private readonly findOneTeacherByIdProvider: FindOneTeacherByIdProvider,

    private readonly softDeleteTeacherByIdProvider: SoftDeleteTeacherByIdProvider,
  ) {}

  public async createGoogleTeacher(googleTeacher: GoogleTeacher) {
    return await this.createGoogleTeacherProvider.createGoogleTeacher(
      googleTeacher,
    );
  }

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
}
