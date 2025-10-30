import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../../entities/teacher.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class ChangeTeacherPasswordProvider {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    private readonly hashingProvider: HashingProvider,
  ) {}

  public async changePassword(
    teacherId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const teacher = await this.teachersRepository.findOne({
      where: { id: teacherId },
      select: ['id', 'password'],
    });

    if (!teacher || !teacher.password) {
      throw new BadRequestException('Teacher not found.');
    }

    const isPasswordValid = await this.hashingProvider.comparePassword(
      currentPassword,
      teacher.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    const hashedPassword = await this.hashingProvider.hashPassword(newPassword);

    await this.teachersRepository.update(
      { id: teacherId },
      { password: hashedPassword },
    );

    return { message: 'Password changed successfully.' };
  }
}
