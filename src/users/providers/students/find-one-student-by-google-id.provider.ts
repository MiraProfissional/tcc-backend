import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/users/entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneStudentByGoogleIdProvider {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  public async findOneStudentByGoogleId(googleId: string) {
    return await this.studentsRepository.findOneBy({ googleId });
  }
}
