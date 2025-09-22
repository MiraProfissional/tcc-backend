import {
  BadRequestException,
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
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    private readonly generateTokensProvider: GenerateTokensProvider,

    private readonly hashingProvider: HashingProvider,

    @Inject(forwardRef(() => StudentsService))
    private readonly studentsService: StudentsService,

    @Inject(forwardRef(() => TeachersService))
    private readonly teachersService: TeachersService,
  ) {}

  public async signIn(signInDto: SignInDto) {
    let user: Student | Teacher | null;

    user = await this.studentsService.findOneStudentByEmail(signInDto.email);

    if (!user) {
      user = await this.teachersService.findOneTeacherByEmail(signInDto.email);
    }

    if (!user) {
      throw new BadRequestException('User not found, please check your email');
    }

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

    return await this.generateTokensProvider.generateTokens(user);
  }
}
