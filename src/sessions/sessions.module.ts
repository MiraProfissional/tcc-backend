import { Module } from '@nestjs/common';
import { SessionsService } from './providers/sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { CreateSessionProvider } from './providers/create-session.provider';

@Module({
  providers: [SessionsService, CreateSessionProvider],
  imports: [TypeOrmModule.forFeature([Session])],
  exports: [SessionsService],
})
export class SessionsModule {}
