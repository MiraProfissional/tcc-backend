import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { StudentsService } from 'src/users/providers/students/students.service';
import { TeachersService } from 'src/users/providers/teachers/teachers.service';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { UserRole } from 'src/users/enums/user-role.enum';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly generateTokensProvider: GenerateTokensProvider,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => StudentsService))
    private readonly studentsService: StudentsService,

    @Inject(forwardRef(() => TeachersService))
    private readonly teachersService: TeachersService,
  ) {}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    let payload: ActiveUserData;

    try {
      payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
        },
      );
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    let user: Student | Teacher;

    if (payload.role == UserRole.STUDENT) {
      user = await this.studentsService.findOneStudentById(payload.sub);
    } else {
      user = await this.teachersService.findOneTeacherById(payload.sub);
    }

    return await this.generateTokensProvider.generateTokens(user);
  }
}
