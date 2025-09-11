import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/users/entities/teacher.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class FindMultipleTeachersByIdProvider {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  /**
   * The method to get multiple teachers from the database by ID
   */
  public async findMultipleTeachersById(
    teachersIds: number[],
  ): Promise<Array<Teacher>> {
    let teachers: Array<Teacher> | null;

    try {
      teachers = await this.teachersRepository.find({
        where: {
          id: In(teachersIds),
        },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!teachers) {
      throw new BadRequestException(
        "Some teacher's ID does not exist, please check the teachers IDs",
      );
    }

    return teachers;
  }
}
