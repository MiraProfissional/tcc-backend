import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StudentsService } from 'src/users/providers/students/students.service';
import { TeachersService } from 'src/users/providers/teachers/teachers.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => TeachersService))
    private readonly teachersService: TeachersService,

    @Inject(forwardRef(() => StudentsService))
    private readonly studentsService: StudentsService,
  ) {}

  public login(email: string, password: string, id: string) {
    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}
