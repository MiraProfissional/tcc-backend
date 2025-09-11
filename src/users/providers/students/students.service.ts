import { Injectable } from '@nestjs/common';
import { FindOneStudentByIdProvider } from './find-one-student-by-id.provider';

@Injectable()
export class StudentsService {
  constructor(
    private readonly findOneStudentByIdProvider: FindOneStudentByIdProvider,
  ) {}

  public async findOneStudentByRegistrationNumber(
    studentRegistrationNumber: number,
  ) {
    return this.findOneStudentByIdProvider.findOneStudentById(
      studentRegistrationNumber,
    );
  }
}
