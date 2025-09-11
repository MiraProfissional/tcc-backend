import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../entities/teacher.entity';
import { Student } from '../entities/student.entity';
import { CreateTeacherDto } from '../dtos/teachers/create-teacher.dto';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  /**
   * The method to get all users from the database
   */
  public findAll() {
    const auth = this.authService.isAuth();
    console.log(auth);

    return [
      {
        name: 'Joao',
        email: 'joao@email.com',
      },
      {
        name: 'Gustavo',
        email: 'gustavo@email.com',
      },
    ];
  }
}
