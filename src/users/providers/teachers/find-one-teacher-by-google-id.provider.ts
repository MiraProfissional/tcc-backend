import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneTeacherByGoogleIdProvider {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  public async findOneTeacherByGoogleId(googleId: string) {
    return await this.teachersRepository.findOneBy({ googleId: googleId });
  }
}
