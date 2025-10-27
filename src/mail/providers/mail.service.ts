import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import { AttendanceConfirmationContext } from '../interfaces/attendence-confirmation-context.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendWelcomeEmail(user: Student | Teacher): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'Face Recognition System <no-reply@face-recognition-system.com>',
      subject: 'Welcome to Face Recognition System',
      template: './welcome',
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: 'http://localhost:5173',
      },
    });
  }

  public async sendAttendanceConfirmation(
    email: string,
    context: AttendanceConfirmationContext,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: 'Face Recognition System <no-reply@face-recognition-system.com>',
      subject: 'Attendance Confirmation - Your Presence Was Recorded',
      template: './attendance-confirmation',
      context,
    });
  }
}
