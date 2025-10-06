import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import faceRecognitionApiLink from '../config/faceRecognitionApi.config';
import { DisciplinesService } from './disciplines.service';
import { Discipline } from '../discipline.entity';
import axios from 'axios';
import { SessionsService } from 'src/sessions/providers/sessions.service';

@Injectable()
export class StopFaceRecognitionProvider {
  constructor(
    private readonly sessionsService: SessionsService,

    @Inject(forwardRef(() => DisciplinesService))
    private readonly disciplinesService: DisciplinesService,

    @Inject(faceRecognitionApiLink.KEY)
    private readonly faceRecognitionApiConfiguration: ConfigType<
      typeof faceRecognitionApiLink
    >,
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
      const response = await axios.post(`${apiLink}/${discipline.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('responde from backend Pyhton, STOP method', response.data);

      return true;
    } catch (error) {
      console.error(
        'Error stopping face recognition in Python Backend Face Recognition API:',
        error,
      );
      throw new Error(
        'Failed to send request to stop face recognition in Pyhton backend',
      );
    }
  }

  private async createSession() {}
}
