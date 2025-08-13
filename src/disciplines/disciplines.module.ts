import { Module } from '@nestjs/common';
import { DisciplinesController } from './disciplines.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discipline } from './discipline.entity';
import { DisciplinesService } from './providers/disciplines.service';

@Module({
  controllers: [DisciplinesController],
  providers: [DisciplinesService],
  imports: [UsersModule, TypeOrmModule.forFeature([Discipline])],
})
export class DisciplinesModule {}
