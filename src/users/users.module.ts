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
import { StudentsService } from './providers/student/students.service';
import { TeacherService } from './providers/teacher/teacher.service';
import { TeachersController } from './controllers/teachers.controller';
import { StudentsController } from './controllers/students.controller';
import { FindOneStudentByRegistrationNumber } from './providers/students/find-one-student-by-registration-number';

@Module({
  controllers: [UsersController, TeachersController, StudentsController],
  providers: [
    UsersService,
    CreateStudentProvider,
    CreateTeacherProvider,
    FindOneTeacherByIdProvider,
    FindOneStudentByIdProvider,
    StudentsService,
    TeacherService,
    FindOneStudentByRegistrationNumber,
  ],
  exports: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Student, Teacher]),
  ],
})
export class UsersModule {}
