import { Injectable } from '@nestjs/common';
import { CreateSessionProvider } from './create-session.provider';
import { CreateSessionInterface } from '../interfaces/create-session.interface';

@Injectable()
export class SessionsService {
  constructor(private readonly createSessionProvider: CreateSessionProvider) {}

  public async createSession(createSessionParam: CreateSessionInterface) {
    return await this.createSessionProvider.createSession(createSessionParam);
  }
}
