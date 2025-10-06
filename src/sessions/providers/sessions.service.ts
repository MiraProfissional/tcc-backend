import { Injectable } from '@nestjs/common';
import { CreateSessionProvider } from './create-session.provider';
import { CreateSession } from '../interfaces/create-session.interface';

@Injectable()
export class SessionsService {
  constructor(private readonly createSessionProvider: CreateSessionProvider) {}

  public async createSession(createSessionParam: CreateSession) {
    return await this.createSessionProvider.createSession(createSessionParam);
  }
}
