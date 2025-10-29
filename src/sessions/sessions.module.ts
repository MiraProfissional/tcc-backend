import { Module } from '@nestjs/common';
import { SessionsService } from './providers/sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { CreateSessionProvider } from './providers/create-session.provider';
import { FindAllSessionsProvider } from './providers/find-all-sessions.provider';
import { FindAllSessionsByDisciplineProvider } from './providers/find-all-sessions-by-discipline.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { SessionsController } from './sessions.controller';

@Module({
  providers: [
    SessionsService,
    CreateSessionProvider,
    FindAllSessionsProvider,
    FindAllSessionsByDisciplineProvider,
  ],
  imports: [TypeOrmModule.forFeature([Session]), PaginationModule],
  exports: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
