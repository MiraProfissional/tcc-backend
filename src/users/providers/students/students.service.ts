import { Injectable } from '@nestjs/common';
import { FindOneStudentByIdProvider } from './find-one-student-by-id.provider';
import { CreateStudentProvider } from './create-student.provider';
import { CreateStudentDto } from 'src/users/dtos/students/create-student.dto';
import { DeleteStudentByIdProvider } from './delete-student-by-id.provider';
import { FindMultipleStudentsByIdProvider } from './find-multiple-students-by-id.provider';
import { FindOneStudentByRegistrationNumberProvider } from './find-one-student-by-registration-number.provider';
import { SoftDeleteStudentByIdProvider } from './soft-delete-student-by-id.provider';

@Injectable()
export class StudentsService {
  constructor(
    private readonly createStudentProvider: CreateStudentProvider,

    private readonly deleteStudentByIdProvider: DeleteStudentByIdProvider,

    private readonly findMultipleStudentsByIdProvider: FindMultipleStudentsByIdProvider,

    private readonly findOneStudentByRegistrationNumberProvider: FindOneStudentByRegistrationNumberProvider,

    private readonly findOneStudentByIdProvider: FindOneStudentByIdProvider,

    private readonly softDeleteStudentByIdProvider: SoftDeleteStudentByIdProvider,
  ) {}

  public async createStudent(createStudentDto: CreateStudentDto) {
    return this.createStudentProvider.createStudent(createStudentDto);
  }

  public async findMultipleStudentsById(studentsIds: number[]) {
    return this.findMultipleStudentsByIdProvider.findMultipleStudents(
      studentsIds,
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
