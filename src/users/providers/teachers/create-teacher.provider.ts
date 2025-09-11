import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeacherDto } from 'src/users/dtos/teachers/create-teacher.dto';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Repository } from 'typeorm';
import { StudentsService } from '../students/students.service';

@Injectable()
export class CreateTeacherProvider {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    private readonly studentsService: StudentsService,
  ) {}

  /**
   * The method to create a teacher in the database
   */
  public async createTeacher(createTeacherDto: CreateTeacherDto) {
    let existingTeacherEmail: Teacher | null;
    let existingTeacherRegistrationNumber: Teacher | null;

    try {
      existingTeacherEmail = await this.teachersRepository.findOne({
        where: { email: createTeacherDto.email },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (existingTeacherEmail) {
      throw new BadRequestException(
        'The user already exists. Please check your email.',
      );
    }

    try {
      existingTeacherRegistrationNumber = await this.teachersRepository.findOne(
        {
          where: { registrationNumber: createTeacherDto.registrationNumber },
        },
      );
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (existingTeacherRegistrationNumber) {
      throw new BadRequestException(
        'The user already exists. Please check your registrationNumber.',
      );
    }

    const existingStudentRegistrationNumber: Student | null =
      await this.studentsService.findOneStudentByRegistrationNumber(
        createTeacherDto.registrationNumber,
      );

    if (existingStudentRegistrationNumber) {
      throw new BadRequestException(
        'This registration number is already used by a student.',
      );
    }

    let newTeacher: Teacher;

    newTeacher = this.teachersRepository.create(createTeacherDto);

    try {
      await this.teachersRepository.save(newTeacher);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return newTeacher;
  }
}
