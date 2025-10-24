import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/users/entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneStudentByCpfProvider {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  /**
   * The method to get one student from the database by Cpf
   */
  public async findOneStudentByCpf(
    studentCpf: string,
  ): Promise<Student | null> {
    let student: Student | null;

    try {
      student = await this.studentsRepository.findOneBy({
        cpf: studentCpf,
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return student;
  }
}
