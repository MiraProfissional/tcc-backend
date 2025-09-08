import { Module } from '@nestjs/common';
import { DisciplinesController } from './disciplines.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discipline } from './discipline.entity';
import { DisciplinesService } from './providers/disciplines.service';
import { ConfigModule } from '@nestjs/config';
import cameraApiConfig from './config/cameraApi.config';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [DisciplinesController],
  providers: [DisciplinesService],
  imports: [
    UsersModule,
    PaginationModule,
    TypeOrmModule.forFeature([Discipline]),
    ConfigModule.forFeature(cameraApiConfig),
  ],
})
export class DisciplinesModule {}
