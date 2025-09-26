import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Repository } from 'typeorm';
import { StudentsService } from '../students/students.service';
import { GoogleTeacher } from 'src/users/interfaces/google-teacher.interface';
import { Student } from 'src/users/entities/student.entity';

@Injectable()
export class CreateGoogleTeacherProvider {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    @Inject(forwardRef(() => StudentsService))
    private readonly studentsService: StudentsService,
  ) {}

  /**
   * The method to create a teacher in the database
   */
  public async createGoogleTeacher(
    googleTeacher: GoogleTeacher,
  ): Promise<Teacher> {
    let existingTeacherEmail: Teacher | null;
    let existingTeacherRegistrationNumber: Teacher | null;

    try {
      existingTeacherEmail = await this.teachersRepository.findOne({
        where: { email: googleTeacher.email },
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
          where: { registrationNumber: googleTeacher.registrationNumber },
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
        googleTeacher.registrationNumber,
      );

    if (existingStudentRegistrationNumber) {
      throw new BadRequestException(
        'This registration number is already used by a student.',
      );
    }

    let newTeacher: Teacher;

    newTeacher = this.teachersRepository.create(googleTeacher);

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
