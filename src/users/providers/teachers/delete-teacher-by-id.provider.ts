import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/users/entities/teacher.entity';
import { UserType } from 'src/users/enums/user-type.enum';
import { UserDeleted } from 'src/users/interfaces/user-deleted.interface';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteTeacherByIdProvider {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  /**
   * The method to delete a teacher from the database by ID
   */
  public async deleteTeacher(teacherId: number): Promise<UserDeleted> {
    let teacherExist: boolean;

    try {
      teacherExist = await this.teachersRepository.exists({
        where: { id: teacherId },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!teacherExist) {
      throw new BadRequestException(
        'Teacher does not exist, please check the teacher ID',
      );
    }

    try {
      await this.teachersRepository.delete(teacherId);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return {
      deleted: true,
      softDeleted: false,
      userId: teacherId,
      userType: UserType.TEACHER,
    };
  }
}
