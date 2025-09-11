import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../entities/teacher.entity';
import { Student } from '../entities/student.entity';
import { CreateTeacherDto } from '../dtos/teachers/create-teacher.dto';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  /**
   * The method to get all users from the database
   */
  public findAll() {
    const auth = this.authService.isAuth();
    console.log(auth);

    return [
      {
        name: 'Joao',
        email: 'joao@email.com',
      },
      {
        name: 'Gustavo',
        email: 'gustavo@email.com',
      },
    ];
  }

  /**
   * The method to get multiple students from the database
   */
  public async findMultipleStudents(studentsIds: number[]) {
    let students: Array<Student> | null;

    try {
      students = await this.studentsRepository.find({
        where: {
          id: In(studentsIds),
        },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!students) {
      throw new BadRequestException(
        "Some student's ID does not exist, please check the students IDs",
      );
    }

    return students;
  }

  /**
   * The method to get multiple teachers from the database
   */
  public async findMultipleTeachers(teachersIds: number[]) {
    let teachers: Array<Teacher> | null;

    try {
      teachers = await this.teachersRepository.find({
        where: {
          id: In(teachersIds),
        },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!teachers) {
      throw new BadRequestException(
        "Some teacher's ID does not exist, please check the teachers IDs",
      );
    }

    return teachers;
  }

  /**
   * The method to delete a student from the database
   */
  public async deleteStudent(studentId: number) {
    let studentExist: boolean;

    try {
      studentExist = await this.studentsRepository.exists({
        where: { id: studentId },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!studentExist) {
      throw new BadRequestException(
        'Student does not exist, please check the student ID',
      );
    }

    try {
      await this.studentsRepository.delete(studentId);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return {
      deleted: true,
      studentId,
    };
  }

  /**
   * The method to soft delete a student from the database
   */
  public async softDeleteStudent(studentId: number) {
    let studentExist: boolean;

    try {
      studentExist = await this.studentsRepository.exists({
        where: { id: studentId },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!studentExist) {
      throw new BadRequestException(
        'Student does not exist, please check the student ID',
      );
    }

    try {
      await this.studentsRepository.softDelete(studentId);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return {
      softDeleted: true,
      studentId,
    };
  }

  /**
   * The method to delete a teacher from the database
   */
  public async deleteTeacher(teacherId: number) {
    let teacherExist: boolean;

    try {
      teacherExist = await this.studentsRepository.exists({
        where: { id: teacherId },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!teacherExist) {
      throw new BadRequestException(
        'Teacher does not exist, please check the student ID',
      );
    }

    try {
      await this.teachersRepository.delete(teacherId);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return {
      deleted: true,
      teacherId,
    };
  }

  /**
   * The method to soft delete a teacher from the database
   */
  public async softDeleteTeacher(teacherId: number) {
    let teacherExist: boolean;

    try {
      teacherExist = await this.studentsRepository.exists({
        where: { id: teacherId },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!teacherExist) {
      throw new BadRequestException(
        'Teacher does not exist, please check the student ID',
      );
    }

    try {
      await this.teachersRepository.softDelete(teacherId);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return {
      softDeleted: true,
      teacherId,
    };
  }
}
