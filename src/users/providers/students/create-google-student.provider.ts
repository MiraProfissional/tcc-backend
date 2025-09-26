import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/users/entities/student.entity';
import { GoogleStudent } from 'src/users/interfaces/google-student.interface';
import { Repository } from 'typeorm';
import { TeachersService } from '../teachers/teachers.service';
import { Teacher } from 'src/users/entities/teacher.entity';

@Injectable()
export class CreateGoogleStudentProvider {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

    @Inject(forwardRef(() => TeachersService))
    private readonly teachersService: TeachersService,
  ) {}

  public async createGoogleStudent(
    googleStudent: GoogleStudent,
  ): Promise<Student> {
    let existingStudentEmail: Student | null;
    let existingStudentRegistrationNumber: Student | null;

    try {
      existingStudentEmail = await this.studentsRepository.findOne({
        where: { email: googleStudent.email },
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
          where: { registrationNumber: googleStudent.registrationNumber },
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

    const existingTeacherRegistrationNumber: Teacher | null =
      await this.teachersService.findOneTeacherByRegistrationNumber(
        googleStudent.registrationNumber,
      );

    if (existingTeacherRegistrationNumber) {
      throw new BadRequestException(
        'This registration number is already used by a teacher.',
      );
    }

    let newStudent: Student;

    newStudent = this.studentsRepository.create(googleStudent);

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
