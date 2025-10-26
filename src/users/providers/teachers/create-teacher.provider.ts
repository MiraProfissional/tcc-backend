import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeacherDto } from 'src/users/dtos/teachers/create-teacher.dto';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Repository } from 'typeorm';
import { StudentsService } from '../students/students.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateTeacherProvider {
  constructor(
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    private readonly mailService: MailService,

    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    @Inject(forwardRef(() => StudentsService))
    private readonly studentsService: StudentsService,
  ) {}

  /**
   * The method to create a teacher in the database
   */
  public async createTeacher(
    createTeacherDto: CreateTeacherDto,
  ): Promise<Teacher> {
    let existingTeacherEmail: Teacher | null;
    let existingTeacherRegistrationNumber: Teacher | null;
    let existingTeacherCpf: Teacher | null;

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
        'The email is already in use by another teacher.',
      );
    }

    let existingStudentEmail: Student | null;
    try {
      existingStudentEmail = await this.studentsService.findOneStudentByEmail(
        createTeacherDto.email,
      );
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (existingStudentEmail) {
      throw new BadRequestException(
        'The email is already in use by a student.',
      );
    }

    try {
      existingTeacherCpf = await this.teachersRepository.findOne({
        where: { cpf: createTeacherDto.cpf },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (existingTeacherCpf) {
      throw new BadRequestException(
        'The CPF is already in use by another teacher.',
      );
    }

    let existingStudentCpf: Student | null;
    try {
      existingStudentCpf = await this.studentsService.findOneStudentByCpf(
        createTeacherDto.cpf,
      );
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (existingStudentCpf) {
      throw new BadRequestException('The CPF is already in use by a student.');
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
        'The registration number is already in use by another teacher.',
      );
    }

    const existingStudentRegistrationNumber: Student | null =
      await this.studentsService.findOneStudentByRegistrationNumber(
        createTeacherDto.registrationNumber,
      );

    if (existingStudentRegistrationNumber) {
      throw new BadRequestException(
        'The registration number is already in use by a student.',
      );
    }

    let newTeacher: Teacher;

    newTeacher = this.teachersRepository.create({
      ...createTeacherDto,
      password: await this.hashingProvider.hashPassword(
        createTeacherDto.password,
      ),
    });

    try {
      await this.teachersRepository.save(newTeacher);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    try {
      await this.mailService.sendWelcomeEmail(newTeacher);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    return newTeacher;
  }
}
