import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllSessionsByDisciplineProvider {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  public async findAllSessionsByDisciplineId(
    disciplineId: number,
  ): Promise<Array<Session>> {
    return await this.sessionRepository.find({
      where: {
        discipline: { id: disciplineId },
      },
    });
  }
}
