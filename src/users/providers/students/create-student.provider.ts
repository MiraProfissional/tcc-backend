import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentDto } from 'src/users/dtos/students/create-student.dto';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Repository } from 'typeorm';
import { TeachersService } from '../teachers/teachers.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateStudentProvider {
  constructor(
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

    @Inject(forwardRef(() => TeachersService))
    private readonly teachersService: TeachersService,
  ) {}

  /**
   * The method to create a student in the database
   */
  public async createStudent(createStudentDto: CreateStudentDto) {
    let existingStudentEmail: Student | null;
    let existingStudentRegistrationNumber: Student | null;

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

    const existingTeacherRegistrationNumber: Teacher | null =
      await this.teachersService.findOneTeacherByRegistrationNumber(
        createStudentDto.registrationNumber,
      );

    if (existingTeacherRegistrationNumber) {
      throw new BadRequestException(
        'This registration number is already used by a teacher.',
      );
    }

    let newStudent: Student;

    newStudent = this.studentsRepository.create({
      ...createStudentDto,
      password: await this.hashingProvider.hashPassword(
        createStudentDto.password,
      ),
    });

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
