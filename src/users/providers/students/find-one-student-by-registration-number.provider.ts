import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/users/entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneStudentByRegistrationNumberProvider {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  /**
   * The method to get one student from the database with your registrationNumber
   */
  public async findOneStudentByRegistrationNumber(
    studentRegistrationNumber: number,
  ): Promise<Student | null> {
    let student: Student | null;

    try {
      student = await this.studentsRepository.findOneBy({
        registrationNumber: studentRegistrationNumber,
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!student) {
      throw new BadRequestException(
        'Student does not exist, please check the student registrationNumber',
      );
    }

    return student;
  }
}
