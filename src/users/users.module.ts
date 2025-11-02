import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { CreateStudentProvider } from './providers/students/create-student.provider';
import { CreateStudentWithFaceProvider } from './providers/students/create-student-with-face.provider';
import { CreateTeacherProvider } from './providers/teachers/create-teacher.provider';
import { FindOneTeacherByIdProvider } from './providers/teachers/find-one-teacher-by-id.provider';
import { FindOneStudentByIdProvider } from './providers/students/find-one-student-by-id.provider';
import { StudentsService } from './providers/students/students.service';
import { TeachersService } from './providers/teachers/teachers.service';
import { TeachersController } from './controllers/teachers.controller';
import { StudentsController } from './controllers/students.controller';
import { PasswordController } from './controllers/password.controller';
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
import { ForgotPasswordProvider } from './providers/forgot-password.provider';
import { ValidateResetTokenProvider } from './providers/validate-reset-token.provider';
import { ResetPasswordProvider } from './providers/reset-password.provider';
import { MailModule } from 'src/mail/mail.module';
import { ChangeStudentPasswordProvider } from './providers/students/change-student-password.provider';
import { ChangeTeacherPasswordProvider } from './providers/teachers/change-teacher-password.provider';
import { Upload } from 'src/uploads/upload.entity';
import uploadFaceApiConfig from 'src/uploads/config/uploadFaceApi.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [TeachersController, StudentsController, PasswordController],
  providers: [
    TeachersService,
    StudentsService,
    CreateStudentProvider,
    CreateStudentWithFaceProvider,
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
    ForgotPasswordProvider,
    ValidateResetTokenProvider,
    ResetPasswordProvider,
    ChangeStudentPasswordProvider,
    ChangeTeacherPasswordProvider,
  ],
  exports: [TeachersService, StudentsService, FindOneStudentByIdProvider],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Student, Teacher, PasswordResetToken, Upload]),
    ConfigModule.forFeature(uploadFaceApiConfig),
    PaginationModule,
    MailModule,
  ],
})
export class UsersModule {}
