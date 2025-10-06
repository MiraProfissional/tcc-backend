import { Injectable } from '@nestjs/common';
import { CreateSession } from '../interfaces/create-session.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateSessionProvider {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  public async createSession(createSessionParam: CreateSession) {}
}
