import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { TeachersService } from 'src/users/providers/teachers/teachers.service';
import { StudentsService } from 'src/users/providers/students/students.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import { UserRole } from 'src/users/enums/user-role.enum';
import { GoogleStudent } from 'src/users/interfaces/google-student.interface';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly generateTokensProvider: GenerateTokensProvider,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @Inject(forwardRef(() => StudentsService))
    private readonly studentsService: StudentsService,

    @Inject(forwardRef(() => TeachersService))
    private readonly teachersService: TeachersService,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.googleToken,
      });

      const payload = loginTicket.getPayload();

      if (!payload) {
        throw new BadRequestException('Invalid Google token');
      }

      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = payload;

      console.log(googleId);

      // Criar metodo pra achar o usuario com o google Id, independente da .service

      let user: Student | Teacher | null;

      if (googleTokenDto.userRole == UserRole.STUDENT) {
        console.log('DO naga');
        user = await this.studentsService.findOneStudentByGoogleId(googleId);
      } else {
        console.log('Da Mel');
        user = await this.teachersService.findOneTeacherByGoogleId(googleId);
      }

      console.log(user);

      if (user) {
        console.log('usuario achado!');
        return this.generateTokensProvider.generateTokens(user);
      }

      let newUser: Student | Teacher;

      if (
        googleTokenDto.userRole == UserRole.STUDENT &&
        googleTokenDto.course
      ) {
        const newStudent: GoogleStudent = {
          firstName: firstName!,
          lastName: lastName!,
          email: email!,
          googleId: googleId,
          dateBirth: googleTokenDto.dateBirth,
          cpf: googleTokenDto.cpf,
          course: googleTokenDto.course,
          cellphone: googleTokenDto.cellphone,
          registrationNumber: googleTokenDto.registrationNumber,
          userRole: googleTokenDto.userRole,
        };
        newUser = await this.studentsService.createGoogleStudent(newStudent);
      } else {
        const newTeacher = {
          firstName: firstName!,
          lastName: lastName!,
          email: email!,
          googleId: googleId,
          dateBirth: googleTokenDto.dateBirth,
          cpf: googleTokenDto.cpf,
          cellphone: googleTokenDto.cellphone,
          registrationNumber: googleTokenDto.registrationNumber,
          userRole: googleTokenDto.userRole,
        };
        newUser = await this.teachersService.createGoogleTeacher(newTeacher);
      }

      return this.generateTokensProvider.generateTokens(newUser);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
