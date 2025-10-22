import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoveStudentsDto } from '../dtos/remove-students-from-discipline.dto';
import { Student } from 'src/users/entities/student.entity';

@Injectable()
export class RemoveStudentsFromDisciplineProvider {
  constructor(
    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,
  ) {}

  public async removeStudentsFromDiscipline(
    removeStudentsDto: RemoveStudentsDto,
  ): Promise<Array<Student>> {
    let discipline: Discipline | null;

    try {
      discipline = await this.disciplinesRepository.findOneBy({
        id: removeStudentsDto.id,
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (!discipline) {
      throw new BadRequestException(
        `Discipline with id: ${removeStudentsDto.id} was not found, please check your id`,
      );
    }

    if (!discipline.students || discipline.students.length === 0) {
      throw new BadRequestException(
        'This discipline has no students to remove',
      );
    }

    const enrolledStudentIds = discipline.students.map((student) => student.id);

    const invalidStudentIds = removeStudentsDto.studentsIds.filter(
      (id) => !enrolledStudentIds.includes(id),
    );

    if (invalidStudentIds.length > 0) {
      throw new BadRequestException(
        `The following student IDs are not enrolled in this discipline: ${invalidStudentIds.join(', ')}. Please verify the student IDs.`,
      );
    }

    const removedStudents = discipline.students.filter((student) =>
      removeStudentsDto.studentsIds.includes(student.id),
    );

    discipline.students = discipline.students.filter(
      (student) => !removeStudentsDto.studentsIds.includes(student.id),
    );

    try {
      await this.disciplinesRepository.save(discipline);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    return removedStudents;
  }
}
