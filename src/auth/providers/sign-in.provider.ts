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
    const user =
      (await this.studentsService.findOneStudentByEmail(signInDto.email)) ??
      (await this.teachersService.findOneTeacherByEmail(signInDto.email));

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
