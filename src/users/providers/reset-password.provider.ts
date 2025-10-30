import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { Student } from '../entities/student.entity';
import { Teacher } from '../entities/teacher.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class ResetPasswordProvider {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly resetTokenRepository: Repository<PasswordResetToken>,

    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    private readonly hashingProvider: HashingProvider,
  ) {}

  public async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const resetToken = await this.resetTokenRepository.findOne({
      where: { token },
      relations: ['student', 'teacher'],
    });

    if (!resetToken) {
      throw new NotFoundException('Invalid or expired reset token.');
    }

    if (resetToken.used) {
      throw new BadRequestException('This reset token has already been used.');
    }

    if (new Date() > resetToken.expiresAt) {
      throw new BadRequestException('This reset token has expired.');
    }

    const hashedPassword = await this.hashingProvider.hashPassword(newPassword);

    if (resetToken.userType === 'STUDENT' && resetToken.student) {
      await this.studentsRepository.update(
        { id: resetToken.student.id },
        { password: hashedPassword },
      );
    } else if (resetToken.userType === 'TEACHER' && resetToken.teacher) {
      await this.teachersRepository.update(
        { id: resetToken.teacher.id },
        { password: hashedPassword },
      );
    } else {
      throw new NotFoundException('User not found.');
    }

    resetToken.used = true;
    await this.resetTokenRepository.save(resetToken);

    return { message: 'Password has been reset successfully.' };
  }
}
