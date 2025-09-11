import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneTeacherByRegistrationNumberProvider {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  /**
   * The method to get one teacher from the database with your registrationNumber
   */
  public async findOneTeacherByRegistrationNumber(
    teacherRegistrationNumber: number,
  ): Promise<Teacher | null> {
    let teacher: Teacher | null;

    try {
      teacher = await this.teachersRepository.findOneBy({
        registrationNumber: teacherRegistrationNumber,
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!teacher) {
      throw new BadRequestException(
        'Teacher does not exist, please check the teacher registrationNumber',
      );
    }

    return teacher;
  }
}
