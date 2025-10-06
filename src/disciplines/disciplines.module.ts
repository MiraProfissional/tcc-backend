import { Module } from '@nestjs/common';
import { DisciplinesController } from './disciplines.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discipline } from './discipline.entity';
import { DisciplinesService } from './providers/disciplines.service';
import { ConfigModule } from '@nestjs/config';
import cameraApiConfig from './config/faceRecognitionApi.config';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CreateDisciplineProvider } from './providers/create-discipline.provider';
import { FindAllDisciplinesProvider } from './providers/find-all-disciplines.provider';
import { DeleteDisciplineByIdProvider } from './providers/delete-discipline-by-id.provider';
import { SoftDeleteDisciplineByIdProvider } from './providers/soft-delete-discipline-by-id.provider';
import { UpdateDisciplineProvider } from './providers/update-discipline.provider';
import { StartFaceRecognitionProvider } from './providers/start-face-recognition.provider';
import { FindOneDisciplineByIdProvider } from './providers/find-one-discipline-by-id.provider';
import { StopFaceRecognitionProvider } from './providers/stop-face-recognition.provider';

@Module({
  controllers: [DisciplinesController],
  providers: [
    DisciplinesService,
    CreateDisciplineProvider,
    FindAllDisciplinesProvider,
    DeleteDisciplineByIdProvider,
    SoftDeleteDisciplineByIdProvider,
    UpdateDisciplineProvider,
    StartFaceRecognitionProvider,
    FindOneDisciplineByIdProvider,
    StopFaceRecognitionProvider,
  ],
  imports: [
    UsersModule,
    PaginationModule,
    TypeOrmModule.forFeature([Discipline]),
    ConfigModule.forFeature(cameraApiConfig),
  ],
  exports: [DisciplinesService],
})
export class DisciplinesModule {}
