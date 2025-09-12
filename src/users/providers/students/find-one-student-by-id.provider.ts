import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/users/entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneStudentByIdProvider {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  /**
   * The method to get one student from the database with your ID
   */
  public async findOneStudentById(studentId: number): Promise<Student> {
    let student: Student | null;

    try {
      student = await this.studentsRepository.findOneBy({ id: studentId });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!student) {
      throw new BadRequestException(
        'Student does not exist, please check the student ID',
      );
    }

    return student;
  }
}
