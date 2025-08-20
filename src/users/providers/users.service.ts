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
import { CreateUserDto } from '../dtos/users/create-user.dto';
import { Teacher } from '../entities/teacher.entity';
import { Student } from '../entities/student.entity';
import { CreateTeacherDto } from '../dtos/teachers/create-teacher.dto';
import { CreateStudentDto } from '../dtos/students/create-student.dto';
import { UserType } from '../enums/user-type.enum';

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
   * The method to create a student in the database
   */
  public async createStudent(createStudentDto: CreateStudentDto) {
    let existingStudent: Student | null;

    try {
      existingStudent = await this.studentsRepository.findOne({
        where: { email: createStudentDto.email },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (existingStudent) {
      throw new BadRequestException(
        'The user already exists. Please check your email.',
      );
    }

    let newStudent: Student;

    newStudent = this.studentsRepository.create(createStudentDto);

    return await this.studentsRepository.save(newStudent);
  }

  /**
   * The method to create a teacher in the database
   */
  public async createTeacher(createTeacherDto: CreateTeacherDto) {
    let existingTeacher: Teacher | null;

    try {
      existingTeacher = await this.teachersRepository.findOne({
        where: { email: createTeacherDto.email },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (existingTeacher) {
      throw new BadRequestException(
        'The user already exists. Please check your email.',
      );
    }

    let newTeacher: Teacher;

    newTeacher = this.teachersRepository.create(createTeacherDto);

    return await this.teachersRepository.save(newTeacher);
  }

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
   * The method to get one student from the database
   */
  public async findOneStudentById(studentId: number) {
    let student: Student | null;

    try {
      student = await this.studentsRepository.findOneBy({ id: studentId });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return student;
  }

  /**
   * The method to get one teacher from the database
   */
  public async findOneTeacherById(teacherId: number) {
    let teacher: Teacher | null;

    try {
      teacher = await this.teachersRepository.findOneBy({ id: teacherId });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return teacher;
  }

  /**
   * The method to get multiple students from the database
   */
  public async findMultipleStudents(studentsIds: number[]) {
    let students: Array<Student>;

    students = await this.studentsRepository.find({
      where: {
        id: In(studentsIds),
      },
    });

    return students;
  }

  /**
   * The method to get multiple teachers from the database
   */
  public async findMultipleTeachers(teachersIds: number[]) {
    let teachers: Array<Teacher>;

    teachers = await this.teachersRepository.find({
      where: {
        id: In(teachersIds),
      },
    });

    return teachers;
  }

  /**
   * The method to delete a student from the database
   */
  public async deleteStudent(studentId: number) {
    await this.studentsRepository.delete(studentId);

    return {
      deleted: true,
      studentId,
    };
  }

  /**
   * The method to soft delete a student from the database
   */
  public async softDeleteStudent(studentId: number) {
    await this.studentsRepository.softDelete(studentId);

    return {
      softDeleted: true,
      studentId,
    };
  }

  /**
   * The method to delete a teacher from the database
   */
  public async deleteTeacher(teacherId: number) {
    await this.teachersRepository.delete(teacherId);

    return {
      deleted: true,
      teacherId,
    };
  }

  /**
   * The method to soft delete a teacher from the database
   */
  public async softDeleteTeacher(teacherId: number) {
    await this.teachersRepository.softDelete(teacherId);

    return {
      softDeleted: true,
      teacherId,
    };
  }
}
