import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import faceRecognitionApiLink from '../config/faceRecognitionApi.config';
import { DisciplinesService } from './disciplines.service';
import { Discipline } from '../discipline.entity';
import axios from 'axios';
import { StartFaceRecognitionInterface } from '../interface/start-face-recognition.interface';

@Injectable()
export class StartFaceRecognitionProvider {
  constructor(
    @Inject(forwardRef(() => DisciplinesService))
    private readonly disciplinesService: DisciplinesService,

    @Inject(faceRecognitionApiLink.KEY)
    private readonly faceRecognitionApiConfiguration: ConfigType<
      typeof faceRecognitionApiLink
    >,
  ) {}

  public async startFaceRecognitionByDisciplineId(disciplineId: number) {
    const discipline: Discipline =
      await this.disciplinesService.findOneDisciplineById(disciplineId);

    const apiLink =
      this.faceRecognitionApiConfiguration.startFaceRecognitionApiLink;
    if (!apiLink) {
      throw new Error('Face API link is not configured.');
    }

    try {
      const { data } = await axios.post<StartFaceRecognitionInterface>(
        `${apiLink}/${discipline.id}?cam=${discipline.ipCamera}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return data;
    } catch (error) {
      console.error(
        'Error starting face recognition in Python Backend Face Recognition API:',
        error,
      );
      throw new Error(
        'Failed to send request to start face recognition in Pyhton backend',
      );
    }
  }
}
