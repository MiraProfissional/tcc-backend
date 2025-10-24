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
import { FindOneTeacherByEmailProvider } from './providers/teachers/find-one-teacher-by-email.provider';
import { FindOneStudentByEmailProvider } from './providers/students/find-one-student-by-email.provider';
import { FindOneStudentByGoogleIdProvider } from './providers/students/find-one-student-by-google-id.provider';
import { FindOneTeacherByGoogleIdProvider } from './providers/teachers/find-one-teacher-by-google-id.provider';
import { CreateGoogleStudentProvider } from './providers/students/create-google-student.provider';
import { CreateGoogleTeacherProvider } from './providers/teachers/create-google-teacher.provider';
import { FindAllTeachersProvider } from './providers/teachers/find-all-teachers.provider';
import { FindAllStudentsProvider } from './providers/students/find-all-students.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { UpdateStudentProvider } from './providers/students/update-student.provider';
import { UpdateTeacherProvider } from './providers/teachers/update-teacher.provider';
import { FindOneTeacherByCpfProvider } from './providers/teachers/find-one-teacher-by-cpf.provider';
import { FindOneStudentByCpfProvider } from './providers/students/find-one-student-by-cpf.provider';

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
    FindOneTeacherByEmailProvider,
    FindOneStudentByEmailProvider,
    FindOneStudentByGoogleIdProvider,
    FindOneTeacherByGoogleIdProvider,
    CreateGoogleStudentProvider,
    CreateGoogleTeacherProvider,
    FindAllTeachersProvider,
    FindAllStudentsProvider,
    UpdateStudentProvider,
    UpdateTeacherProvider,
    FindOneTeacherByCpfProvider,
    FindOneStudentByCpfProvider,
  ],
  exports: [TeachersService, StudentsService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Student, Teacher]),
    PaginationModule,
  ],
})
export class UsersModule {}
