import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatchStudentDto } from 'src/users/dtos/students/patch-student.dto';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Repository } from 'typeorm';
import { TeachersService } from '../teachers/teachers.service';

@Injectable()
export class UpdateStudentProvider {
  constructor(
    @Inject(forwardRef(() => TeachersService))
    private readonly teachersService: TeachersService,

    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  public async updateStudent(
    patchStudentDto: PatchStudentDto,
  ): Promise<Student> {
    let student: Student | null;

    try {
      student = await this.studentsRepository.findOneBy({
        id: patchStudentDto.id,
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!student) {
      throw new BadRequestException(
        `Student with id: ${patchStudentDto.id} was not found, please check your id`,
      );
    }

    if (patchStudentDto.email) {
      let existingUser: Teacher | Student | null;

      try {
        existingUser = await this.studentsRepository.findOne({
          where: { email: patchStudentDto.email },
        });
      } catch {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment, please try later.',
          { description: 'Error connecting to the database.' },
        );
      }

      if (existingUser) {
        throw new BadRequestException(
          `The email: ${patchStudentDto.email} is already in use by another student.`,
        );
      } else if (!existingUser) {
        existingUser = await this.teachersService.findOneTeacherByEmail(
          patchStudentDto.email,
        );

        if (existingUser) {
          throw new BadRequestException(
            `The email: ${patchStudentDto.email} is already in use by a teacher.`,
          );
        } else {
          student.email = patchStudentDto.email;
        }
      }
    }

    if (patchStudentDto.cpf) {
      let existingUser: Teacher | Student | null;

      try {
        existingUser = await this.studentsRepository.findOne({
          where: { cpf: patchStudentDto.cpf },
        });
      } catch {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment, please try later.',
          { description: 'Error connecting to the database.' },
        );
      }

      if (existingUser) {
        throw new BadRequestException(
          `The cpf: ${patchStudentDto.cpf} is already in use by another student.`,
        );
      } else if (!existingUser) {
        existingUser = await this.teachersService.findOneTeacherByCpf(
          patchStudentDto.cpf,
        );

        if (existingUser) {
          throw new BadRequestException(
            `The cpf: ${patchStudentDto.cpf} is already in use by a teacher.`,
          );
        } else {
          student.cpf = patchStudentDto.cpf;
        }
      }
    }

    if (patchStudentDto.registrationNumber) {
      let existingUser: Teacher | Student | null;

      try {
        existingUser = await this.studentsRepository.findOne({
          where: { registrationNumber: patchStudentDto.registrationNumber },
        });
      } catch {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment, please try later.',
          { description: 'Error connecting to the database.' },
        );
      }

      if (existingUser) {
        throw new BadRequestException(
          `The registration number: ${patchStudentDto.registrationNumber} is already in use by another student.`,
        );
      } else if (!existingUser) {
        existingUser =
          await this.teachersService.findOneTeacherByRegistrationNumber(
            patchStudentDto.registrationNumber,
          );

        if (existingUser) {
          throw new BadRequestException(
            `The registration number: ${patchStudentDto.registrationNumber} is already in use by a teacher.`,
          );
        } else {
          student.registrationNumber = patchStudentDto.registrationNumber;
        }
      }
    }

    student.firstName = patchStudentDto.firstName ?? student.firstName;
    student.lastName = patchStudentDto.lastName ?? student.lastName;
    student.cellphone = patchStudentDto.cellphone ?? student.cellphone;
    student.course = patchStudentDto.course ?? student.course;

    if (patchStudentDto.dateBirth) {
      student.dateBirth = new Date(patchStudentDto.dateBirth);
    }

    return student;
  }
}
