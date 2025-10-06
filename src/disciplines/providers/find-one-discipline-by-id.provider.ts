import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discipline } from '../discipline.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneDisciplineByIdProvider {
  constructor(
    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,
  ) {}

  /**
   * The method to get one discipline from the database with your ID
   */
  public async findOneDisciplineById(
    disciplineId: number,
  ): Promise<Discipline> {
    let discipline: Discipline | null;

    try {
      discipline = await this.disciplinesRepository.findOneBy({
        id: disciplineId,
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!discipline) {
      throw new BadRequestException(
        'Discipline does not exist, please check the discipline ID',
      );
    }

    return discipline;
  }
}
