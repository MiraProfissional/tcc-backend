import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class ChangeStudentPasswordProvider {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

    private readonly hashingProvider: HashingProvider,
  ) {}

  public async changePassword(
    studentId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
      select: ['id', 'password'],
    });

    if (!student || !student.password) {
      throw new BadRequestException('Student not found.');
    }

    const isPasswordValid = await this.hashingProvider.comparePassword(
      currentPassword,
      student.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    const hashedPassword = await this.hashingProvider.hashPassword(newPassword);

    await this.studentsRepository.update(
      { id: studentId },
      { password: hashedPassword },
    );

    return { message: 'Password changed successfully.' };
  }
}
