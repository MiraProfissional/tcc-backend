import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/users/entities/student.entity';
import { UserType } from 'src/users/enums/user-type.enum';
import { UserDeleted } from 'src/users/interfaces/user-deleted.interface';
import { Repository } from 'typeorm';

@Injectable()
export class SoftDeleteStudentByIdProvider {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  /**
   * The method to soft delete a student from the database by ID
   */
  public async softDeleteStudent(studentId: number): Promise<UserDeleted> {
    let studentExist: boolean;

    try {
      studentExist = await this.studentsRepository.exists({
        where: { id: studentId },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!studentExist) {
      throw new BadRequestException(
        'Student does not exist, please check the student ID',
      );
    }

    try {
      await this.studentsRepository.softDelete(studentId);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return {
      deleted: true,
      softDeleted: true,
      userId: studentId,
      userType: UserType.STUDENT,
    };
  }
}
