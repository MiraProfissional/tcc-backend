import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentDto } from 'src/users/dtos/students/create-student.dto';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateStudentProvider {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  /**
   * The method to create a student in the database
   */
  public async createStudent(createStudentDto: CreateStudentDto) {
    let existingStudentEmail: Student | null;
    let existingStudentRegistrationNumber: Student | null;
    let existingTeacherRegistrationNumber: Teacher | null;

    try {
      existingStudentEmail = await this.studentsRepository.findOne({
        where: { email: createStudentDto.email },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (existingStudentEmail) {
      throw new BadRequestException(
        'The user already exists. Please check your email.',
      );
    }

    try {
      existingStudentRegistrationNumber = await this.studentsRepository.findOne(
        {
          where: { registrationNumber: createStudentDto.registrationNumber },
        },
      );
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (existingStudentRegistrationNumber) {
      throw new BadRequestException(
        'The user already exists. Please check your registrationNumber.',
      );
    }

    try {
      existingTeacherRegistrationNumber = await this.teachersRepository.findOne(
        {
          where: { registrationNumber: createStudentDto.registrationNumber },
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
        'This registration number is already used by a teacher.',
      );
    }

    let newStudent: Student;

    newStudent = this.studentsRepository.create(createStudentDto);

    try {
      await this.studentsRepository.save(newStudent);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return newStudent;
  }
}
