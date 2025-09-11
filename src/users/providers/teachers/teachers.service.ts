import { Injectable } from '@nestjs/common';
import { FindOneTeacherByIdProvider } from './find-one-teacher-by-id.provider';
import { CreateTeacherProvider } from './create-teacher.provider';
import { Teacher } from 'src/users/entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    private readonly findOneTeacherByIdProvider: FindOneTeacherByIdProvider,

    private readonly createTeacherProvider: CreateTeacherProvider,
  ) {}

  public async createTeacher() {
    return await this.createTeacherProvider;
  }

  public async findOneTeacherById(teacherId: number): Promise<Teacher | null> {
    return await this.findOneTeacherByIdProvider.findOneTeacherById(teacherId);
  }
}
