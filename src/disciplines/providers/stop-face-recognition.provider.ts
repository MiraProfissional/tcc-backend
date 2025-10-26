import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import faceRecognitionApiLink from '../config/faceRecognitionApi.config';
import { DisciplinesService } from './disciplines.service';
import { Discipline } from '../discipline.entity';
import axios from 'axios';
import { SessionsService } from 'src/sessions/providers/sessions.service';
import { CreateSessionInterface } from 'src/sessions/interfaces/create-session.interface';
import { StopFaceRecognitionInterface } from '../interface/stop-face-recognition.interface';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class StopFaceRecognitionProvider {
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

  public async stopFaceRecognitionByDisciplineId(disciplineId: number) {
    const discipline: Discipline =
      await this.disciplinesService.findOneDisciplineById(disciplineId);

    const apiLink =
      this.faceRecognitionApiConfiguration.stopFaceRecognitionApiLink;
    if (!apiLink) {
      throw new Error('Face API link is not configured.');
    }

    try {
      const { data } = await axios.post<StopFaceRecognitionInterface>(
        `${apiLink}/${discipline.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

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

      const createdSession =
        await this.sessionsService.createSession(newSession);

      // Enviar email de confirmação de presença para cada aluno presente
      const sessionDate = new Date(data.start_time).toLocaleDateString('pt-BR');
      const sessionTime = new Date(data.start_time).toLocaleTimeString(
        'pt-BR',
        {
          hour: '2-digit',
          minute: '2-digit',
        },
      );

      for (const student of newSession.presentStudents) {
        await this.mailService.sendAttendanceConfirmation(student.email, {
          studentName: `${student.firstName} ${student.lastName}`,
          disciplineName: discipline.name,
          teacherName: `${discipline.teacher.firstName} ${discipline.teacher.lastName}`,
          sessionDate,
          sessionTime,
          location: `${discipline.disciplineRoom}`,
          dashboardUrl:
            process.env.FRONTEND_URL || 'http://localhost:5173/home',
        });
      }

      return createdSession;
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the backend Pyhton.' },
      );
    }
  }
}
