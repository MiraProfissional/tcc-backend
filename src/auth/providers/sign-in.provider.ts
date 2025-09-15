import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { TeachersService } from 'src/users/providers/teachers/teachers.service';
import { StudentsService } from 'src/users/providers/students/students.service';
import { HashingProvider } from './hashing.provider';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => TeachersService))
    private readonly teachersService: TeachersService,

    @Inject(forwardRef(() => StudentsService))
    private readonly studentsService: StudentsService,

    private readonly hashingProvider: HashingProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    let user: Student | Teacher | null;

    user = await this.studentsService.findOneStudentByEmail(signInDto.email);

    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords.',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }
    return true;
  }
}
