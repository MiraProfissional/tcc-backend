import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { CreateStudentProvider } from './providers/students/create-student.provider';
import { CreateTeacherProvider } from './providers/teachers/create-teacher.provider';
import { FindOneTeacherByIdProvider } from './providers/teachers/find-one-teacher-by-id.provider';
import { FindOneStudentByIdProvider } from './providers/students/find-one-student-by-id.provider';
import { StudentsService } from './providers/students/students.service';
import { TeachersService } from './providers/teachers/teachers.service';
import { TeachersController } from './controllers/teachers.controller';
import { StudentsController } from './controllers/students.controller';
import { FindOneTeacherByRegistrationNumberProvider } from './providers/teachers/find-one-teacher-by-registration-number.provider';
import { FindOneStudentByRegistrationNumberProvider } from './providers/students/find-one-student-by-registration-number.provider';
import { DeleteTeacherByIdProvider } from './providers/teachers/delete-teacher-by-id.provider';
import { SoftDeleteTeacherByIdProvider } from './providers/teachers/soft-delete-teacher-by-id.provider';
import { FindMultipleTeachersByIdProvider } from './providers/teachers/find-multiple-teachers-by-id.provider';
import { FindMultipleStudentsByIdProvider } from './providers/students/find-multiple-students-by-id.provider';
import { SoftDeleteStudentByIdProvider } from './providers/students/soft-delete-student-by-id.provider';
import { DeleteStudentByIdProvider } from './providers/students/delete-student-by-id.provider';

@Module({
  controllers: [TeachersController, StudentsController],
  providers: [
    TeachersService,
    StudentsService,
    CreateStudentProvider,
    CreateTeacherProvider,
    FindOneTeacherByIdProvider,
    FindOneStudentByIdProvider,
    FindOneTeacherByRegistrationNumberProvider,
    FindOneStudentByRegistrationNumberProvider,
    DeleteTeacherByIdProvider,
    SoftDeleteTeacherByIdProvider,
    FindMultipleTeachersByIdProvider,
    FindMultipleStudentsByIdProvider,
    SoftDeleteStudentByIdProvider,
    DeleteStudentByIdProvider,
  ],
  exports: [TeachersService, StudentsService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Student, Teacher]),
  ],
})
export class UsersModule {}
