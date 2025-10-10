import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/users/entities/student.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class FindMultipleStudentsByIdProvider {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  /**
   * The method to get multiple students from the database with ID
   */
  public async findMultipleStudentsById(
    studentsIds: number[],
  ): Promise<Array<Student>> {
    let students: Array<Student> | null;

    try {
      students = await this.studentsRepository.find({
        where: {
          id: In(studentsIds),
        },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!students) {
      throw new BadRequestException(
        "Some student's ID does not exist, please check the students IDs",
      );
    }

    return students;
  }
}
