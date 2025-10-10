import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateSessionInterface } from '../interfaces/create-session.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateSessionProvider {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  public async createSession(createSessionInterface: CreateSessionInterface) {
    const newSession = this.sessionRepository.create(createSessionInterface);

    try {
      await this.sessionRepository.save(newSession);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return newSession;
  }
}
