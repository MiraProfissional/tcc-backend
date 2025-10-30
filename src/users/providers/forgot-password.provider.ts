import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/providers/mail.service';
import { FindOneStudentByEmailProvider } from './students/find-one-student-by-email.provider';
import { FindOneTeacherByEmailProvider } from './teachers/find-one-teacher-by-email.provider';
import { Student } from '../entities/student.entity';
import { Teacher } from '../entities/teacher.entity';

@Injectable()
export class ForgotPasswordProvider {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly resetTokenRepository: Repository<PasswordResetToken>,

    private readonly findOneStudentByEmailProvider: FindOneStudentByEmailProvider,
    private readonly findOneTeacherByEmailProvider: FindOneTeacherByEmailProvider,
    private readonly mailService: MailService,
  ) {}

  public async forgotPassword(email: string): Promise<{ message: string }> {
    let user: Student | Teacher | null = null;
    let userType: 'STUDENT' | 'TEACHER' | null = null;

    const student =
      await this.findOneStudentByEmailProvider.findOneStudentByEmail(email);
    if (student) {
      user = student;
      userType = 'STUDENT';
    } else {
      const teacher =
        await this.findOneTeacherByEmailProvider.findOneTeacherByEmail(email);
      if (teacher) {
        user = teacher;
        userType = 'TEACHER';
      }
    }

    if (!user || !userType) {
      throw new NotFoundException('User with this email does not exist.');
    }

    await this.resetTokenRepository.delete({ email });

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const resetToken = this.resetTokenRepository.create({
      token,
      email,
      userType,
      student: userType === 'STUDENT' ? (user as Student) : null,
      teacher: userType === 'TEACHER' ? (user as Teacher) : null,
      expiresAt,
      used: false,
    } as Partial<PasswordResetToken>);

    await this.resetTokenRepository.save(resetToken);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await this.mailService.sendPasswordResetEmail(user.email, {
      name: user.firstName,
      resetUrl,
      expirationTime: '1 hora',
    });

    return {
      message: 'Password reset email sent successfully. Check your inbox.',
    };
  }
}
