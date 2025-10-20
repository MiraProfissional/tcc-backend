import { Injectable } from '@nestjs/common';
import { FindOneStudentByIdProvider } from './find-one-student-by-id.provider';
import { CreateStudentProvider } from './create-student.provider';
import { CreateStudentDto } from 'src/users/dtos/students/create-student.dto';
import { DeleteStudentByIdProvider } from './delete-student-by-id.provider';
import { FindMultipleStudentsByIdProvider } from './find-multiple-students-by-id.provider';
import { FindOneStudentByRegistrationNumberProvider } from './find-one-student-by-registration-number.provider';
import { SoftDeleteStudentByIdProvider } from './soft-delete-student-by-id.provider';
import { FindOneStudentByEmailProvider } from './find-one-student-by-email.provider';
import { FindOneStudentByGoogleIdProvider } from './find-one-student-by-google-id.provider';
import { CreateGoogleStudentProvider } from './create-google-student.provider';
import { GoogleStudent } from 'src/users/interfaces/google-student.interface';
import { GetUserParamDto } from 'src/users/dtos/users/get-users-param.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { FindAllStudentsProvider } from './find-all-students.provider';

@Injectable()
export class StudentsService {
  constructor(
    private readonly createGoogleStudentProvider: CreateGoogleStudentProvider,

    private readonly createStudentProvider: CreateStudentProvider,

    private readonly deleteStudentByIdProvider: DeleteStudentByIdProvider,

    private readonly findAllStudentsProvider: FindAllStudentsProvider,

    private readonly findMultipleStudentsByIdProvider: FindMultipleStudentsByIdProvider,

    private readonly findOneStudentByEmailProvider: FindOneStudentByEmailProvider,

    private readonly findOneStudentByGoogleIdProvider: FindOneStudentByGoogleIdProvider,

    private readonly findOneStudentByRegistrationNumberProvider: FindOneStudentByRegistrationNumberProvider,

    private readonly findOneStudentByIdProvider: FindOneStudentByIdProvider,

    private readonly softDeleteStudentByIdProvider: SoftDeleteStudentByIdProvider,
  ) {}

  public async createGoogleStudent(googleStudent: GoogleStudent) {
    return await this.createGoogleStudentProvider.createGoogleStudent(
      googleStudent,
    );
  }

  public async createStudent(createStudentDto: CreateStudentDto) {
    return this.createStudentProvider.createStudent(createStudentDto);
  }

  public findStudents(
    getUsersParamDto: GetUserParamDto,
    paginationQueryDto: PaginationQueryDto,
  ) {
    if (getUsersParamDto?.id) {
      return this.findOneStudentByIdProvider.findOneStudentById(
        getUsersParamDto.id,
      );
    } else {
      return this.findAllStudentsProvider.findAllStudents(paginationQueryDto);
    }
  }

  public async findMultipleStudentsById(studentsIds: number[]) {
    return this.findMultipleStudentsByIdProvider.findMultipleStudentsById(
      studentsIds,
    );
  }

  public async findOneStudentByEmail(studentEmail: string) {
    return await this.findOneStudentByEmailProvider.findOneStudentByEmail(
      studentEmail,
    );
  }

  public async findOneStudentByGoogleId(googleId: string) {
    return await this.findOneStudentByGoogleIdProvider.findOneStudentByGoogleId(
      googleId,
    );
  }

  public async findOneStudentById(studentId: number) {
    return await this.findOneStudentByIdProvider.findOneStudentById(studentId);
  }

  public async findOneStudentByRegistrationNumber(
    studentRegistrationNumber: number,
  ) {
    return this.findOneStudentByRegistrationNumberProvider.findOneStudentByRegistrationNumber(
      studentRegistrationNumber,
    );
  }

  public async deleteStudentById(studentId: number) {
    return await this.deleteStudentByIdProvider.deleteStudent(studentId);
  }

  public async softDeleteStudentById(studentId: number) {
    return await this.softDeleteStudentByIdProvider.softDeleteStudent(
      studentId,
    );
  }
}
