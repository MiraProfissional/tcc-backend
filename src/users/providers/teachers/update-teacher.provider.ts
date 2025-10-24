import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatchTeacherDto } from 'src/users/dtos/teachers/patch-teacher.dto';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Student } from 'src/users/entities/student.entity';
import { Repository } from 'typeorm';
import { StudentsService } from '../students/students.service';

@Injectable()
export class UpdateTeacherProvider {
  constructor(
    @Inject(forwardRef(() => StudentsService))
    private readonly studentsService: StudentsService,

    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  public async updateTeacher(
    patchTeacherDto: PatchTeacherDto,
  ): Promise<Teacher> {
    let teacher: Teacher | null;

    try {
      teacher = await this.teachersRepository.findOneBy({
        id: patchTeacherDto.id,
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!teacher) {
      throw new BadRequestException(
        `Teacher with id: ${patchTeacherDto.id} was not found, please check your id`,
      );
    }

    if (patchTeacherDto.email) {
      let existingUser: Teacher | Student | null;

      try {
        existingUser = await this.teachersRepository.findOne({
          where: { email: patchTeacherDto.email },
        });
      } catch {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment, please try later.',
          { description: 'Error connecting to the database.' },
        );
      }

      if (existingUser) {
        throw new BadRequestException(
          `The email: ${patchTeacherDto.email} is already in use by another teacher.`,
        );
      } else if (!existingUser) {
        existingUser = await this.studentsService.findOneStudentByEmail(
          patchTeacherDto.email,
        );

        if (existingUser) {
          throw new BadRequestException(
            `The email: ${patchTeacherDto.email} is already in use by a student.`,
          );
        } else {
          teacher.email = patchTeacherDto.email;
        }
      }
    }

    if (patchTeacherDto.cpf) {
      let existingUser: Teacher | Student | null;

      try {
        existingUser = await this.teachersRepository.findOne({
          where: { cpf: patchTeacherDto.cpf },
        });
      } catch {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment, please try later.',
          { description: 'Error connecting to the database.' },
        );
      }

      if (existingUser) {
        throw new BadRequestException(
          `The cpf: ${patchTeacherDto.cpf} is already in use by another teacher.`,
        );
      } else if (!existingUser) {
        existingUser = await this.studentsService.findOneStudentByCpf(
          patchTeacherDto.cpf,
        );

        if (existingUser) {
          throw new BadRequestException(
            `The cpf: ${patchTeacherDto.cpf} is already in use by a student.`,
          );
        } else {
          teacher.cpf = patchTeacherDto.cpf;
        }
      }
    }

    if (patchTeacherDto.registrationNumber) {
      let existingUser: Teacher | Student | null;

      try {
        existingUser = await this.teachersRepository.findOne({
          where: { registrationNumber: patchTeacherDto.registrationNumber },
        });
      } catch {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment, please try later.',
          { description: 'Error connecting to the database.' },
        );
      }

      if (existingUser) {
        throw new BadRequestException(
          `The registration number: ${patchTeacherDto.registrationNumber} is already in use by another teacher.`,
        );
      } else if (!existingUser) {
        existingUser =
          await this.studentsService.findOneStudentByRegistrationNumber(
            patchTeacherDto.registrationNumber,
          );

        if (existingUser) {
          throw new BadRequestException(
            `The registration number: ${patchTeacherDto.registrationNumber} is already in use by a student.`,
          );
        } else {
          teacher.registrationNumber = patchTeacherDto.registrationNumber;
        }
      }
    }

    teacher.firstName = patchTeacherDto.firstName ?? teacher.firstName;
    teacher.lastName = patchTeacherDto.lastName ?? teacher.lastName;
    teacher.cellphone = patchTeacherDto.cellphone ?? teacher.cellphone;

    if (patchTeacherDto.dateBirth) {
      teacher.dateBirth = new Date(patchTeacherDto.dateBirth);
    }

    try {
      await this.teachersRepository.save(teacher);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return teacher;
  }
}
