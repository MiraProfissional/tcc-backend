import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisciplineDeleted } from '../interfaces/discipline-deleted.interface';
@Injectable()
export class DeleteDisciplineByIdProvider {
  constructor(
    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,
  ) {}

  /**
   * The method to delete a discipline from the database by ID
   */
  public async deleteDiscipline(
    disciplineId: number,
  ): Promise<DisciplineDeleted> {
    let disciplineExist: boolean;

    try {
      disciplineExist = await this.disciplinesRepository.exists({
        where: { id: disciplineId },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!disciplineExist) {
      throw new BadRequestException(
        'Discipline does not exist, please check the discipline ID',
      );
    }

    try {
      await this.disciplinesRepository.delete(disciplineId);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return {
      deleted: true,
      softDeleted: false,
      disciplineId: disciplineId,
    };
  }
}
