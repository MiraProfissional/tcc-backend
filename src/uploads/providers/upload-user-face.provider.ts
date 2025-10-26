import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';
import * as FormData from 'form-data';
import axios from 'axios';
import uploadFaceApiConfig from '../config/uploadFaceApi.config';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import { FindOneStudentByIdProvider } from 'src/users/providers/students/find-one-student-by-id.provider';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadUserFaceProvider {
  constructor(
    @Inject(forwardRef(() => FindOneStudentByIdProvider))
    private readonly findOneStudentByIdProvider: FindOneStudentByIdProvider,

    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,

    @Inject(uploadFaceApiConfig.KEY)
    private readonly uploadFaceApiConfiguration: ConfigType<
      typeof uploadFaceApiConfig
    >,
  ) {}

  public async sendImageToFaceRecognitionBackend(
    file: Express.Multer.File,
    user: ActiveUserData,
  ) {
    const activeUser: Student =
      await this.findOneStudentByIdProvider.findOneStudentById(user.sub);

    const newFileName = this.generateFileName(file, activeUser);

    const apiLink = this.uploadFaceApiConfiguration.userFaceApiLink;
    if (!apiLink) {
      throw new Error('Face API link is not configured.');
    }

    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: newFileName,
      contentType: file.mimetype,
    });

    try {
      await axios.post(apiLink, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
    } catch {
      throw new RequestTimeoutException(
        'Failed to send image to face recognition backend',
      );
    }

    const upload = this.uploadRepository.create({
      name: newFileName,
      type: fileTypes.IMAGE,
      student: activeUser,
    });

    try {
      await this.uploadRepository.save(upload);
    } catch {
      throw new RequestTimeoutException(
        'Failed to save upload record to the database',
      );
    }

    return upload;
  }

  private generateFileName(
    file: Express.Multer.File,
    user: Student | Teacher,
  ): string {
    const name = `${user.registrationNumber}-${user.firstName}-${user.lastName}`
      .replace(/\s/g, '')
      .trim();
    const extension = path.extname(file.originalname);
    const timestamp = new Date().getTime().toString().trim();
    return `${name}-${timestamp}-${uuid4()}${extension}`;
  }
}
