import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import faceRecognitionApiLink from '../config/faceRecognitionApi.config';
import { DisciplinesService } from './disciplines.service';
import { Discipline } from '../discipline.entity';
import axios, { AxiosError } from 'axios';
import { SessionsService } from 'src/sessions/providers/sessions.service';
import { CreateSessionInterface } from 'src/sessions/interfaces/create-session.interface';
import { StopFaceRecognitionInterface } from '../interface/stop-face-recognition.interface';
import { MailService } from 'src/mail/providers/mail.service';
import { Session } from 'src/sessions/session.entity';

@Injectable()
export class StopFaceRecognitionProvider {
  private readonly logger = new Logger(StopFaceRecognitionProvider.name);

  constructor(
    @Inject(forwardRef(() => DisciplinesService))
    private readonly disciplinesService: DisciplinesService,

    @Inject(faceRecognitionApiLink.KEY)
    private readonly faceRecognitionApiConfiguration: ConfigType<
      typeof faceRecognitionApiLink
    >,

    private readonly sessionsService: SessionsService,
    private readonly mailService: MailService,
  ) {}

  public async stopFaceRecognitionByDisciplineId(
    disciplineId: number,
  ): Promise<Session> {
    if (!disciplineId || disciplineId <= 0) {
      throw new BadRequestException('Invalid discipline ID provided.');
    }

    const discipline =
      await this.disciplinesService.findOneDisciplineById(disciplineId);

    if (!discipline.teacher) {
      throw new BadRequestException(
        'Discipline must have an associated teacher.',
      );
    }

    if (
      discipline.ipCamera === null ||
      discipline.ipCamera === undefined ||
      discipline.ipCamera < 0
    ) {
      throw new BadRequestException(
        'Discipline must have a valid IP camera index configured.',
      );
    }

    const apiLink =
      this.faceRecognitionApiConfiguration.stopFaceRecognitionApiLink;
    if (!apiLink) {
      throw new InternalServerErrorException(
        'Face Recognition API is not configured properly.',
      );
    }

    let data: StopFaceRecognitionInterface;
    try {
      const response = await axios.post<StopFaceRecognitionInterface>(
        `${apiLink}/${discipline.id}`,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        },
      );
      data = response.data;

      if (!data || !data.start_time || !data.stop_time) {
        throw new Error('Invalid response from Face Recognition API.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        this.logger.error(`Face Recognition API error: ${axiosError.message}`);

        if (axiosError.code === 'ECONNABORTED') {
          throw new RequestTimeoutException(
            'Face Recognition API request timeout.',
          );
        }

        if (axiosError.response?.status === 404) {
          throw new BadRequestException(
            'Face Recognition session not found for this discipline.',
          );
        }
      }

      throw new RequestTimeoutException(
        'Unable to connect to Face Recognition API. Please try again later.',
      );
    }

    const recognizedFaces = (data.recognized_faces ?? []).map(
      (registrationNumber: string | number) =>
        Number(String(registrationNumber).trim()),
    );

    const newSession: CreateSessionInterface = {
      day: data.start_time.toString().split('T')[0],
      startedAt: new Date(data.start_time),
      endedAt: new Date(data.stop_time),
      cameraIndex: discipline.ipCamera,
      discipline: discipline,
      openedBy: discipline.teacher,
      presentStudents: (discipline.students ?? []).filter((student) =>
        recognizedFaces.includes(student.registrationNumber),
      ),
      absentStudents: (discipline.students ?? []).filter(
        (student) => !recognizedFaces.includes(student.registrationNumber),
      ),
    };

    if (newSession.startedAt >= newSession.endedAt) {
      throw new BadRequestException(
        'Session start time must be before end time.',
      );
    }

    const createdSession = await this.sessionsService.createSession(newSession);

    if (newSession.presentStudents.length > 0) {
      this.sendAttendanceEmails(
        newSession.presentStudents,
        discipline,
        data.start_time,
      ).catch((error) => {
        this.logger.error(
          `Failed to send emails: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      });
    }

    return createdSession;
  }

  private async sendAttendanceEmails(
    presentStudents: any[],
    discipline: Discipline,
    startTime: string,
  ): Promise<void> {
    const sessionDate = new Date(startTime).toLocaleDateString('pt-BR');
    const sessionTime = new Date(startTime).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const emailPromises = presentStudents.map(async (student) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!student.email) return;

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        await this.mailService.sendAttendanceConfirmation(student.email, {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          studentName: `${student.firstName} ${student.lastName}`,
          disciplineName: discipline.name,
          teacherName: `${discipline.teacher.firstName} ${discipline.teacher.lastName}`,
          sessionDate,
          sessionTime,
          location: `${discipline.disciplineRoom}`,
          dashboardUrl:
            process.env.FRONTEND_URL || 'http://localhost:5173/home',
        });
      } catch {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.logger.error(`Failed to send email to ${student.email}`);
      }
    });

    await Promise.allSettled(emailPromises);
  }
}
