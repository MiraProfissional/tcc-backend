import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { CreateStudentProvider } from './providers/student/create-student.provider';
import { CreateTeacherProvider } from './providers/teacher/create-teacher.provider';
import { FindOneTeacherByIdProvider } from './providers/teacher/find-one-teacher-by-id.provider';
import { FindOneStudentByIdProvider } from './providers/student/find-one-student-by-id.provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateStudentProvider,
    CreateTeacherProvider,
    FindOneTeacherByIdProvider,
    FindOneStudentByIdProvider,
  ],
  exports: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Student, Teacher]),
  ],
})
export class UsersModule {}
