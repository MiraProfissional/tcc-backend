import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';
import * as FormData from 'form-data';
import axios from 'axios';
import uploadFaceApiConfig from '../config/uploadFaceApi.config';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import { StudentsService } from 'src/users/providers/students/students.service';
import { TeachersService } from 'src/users/providers/teachers/teachers.service';
import { UserRole } from 'src/users/enums/user-role.enum';

@Injectable()
export class UploadUserFaceProvider {
  constructor(
    private readonly studenstService: StudentsService,

    private readonly teachersService: TeachersService,

    @Inject(uploadFaceApiConfig.KEY)
    private readonly uploadFaceApiConfiguration: ConfigType<
      typeof uploadFaceApiConfig
    >,
  ) {}

  public async sendImageToFaceRecognitionBackend(
    file: Express.Multer.File,
    user: ActiveUserData,
  ) {
    let activeUser: Student | Teacher;

    if (user.role == UserRole.STUDENT) {
      activeUser = await this.studenstService.findOneStudentById(user.sub);
    } else {
      activeUser = await this.teachersService.findOneTeacherById(user.sub);
    }

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
      const response = await axios.post(apiLink, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      return response.data.fileUrl || newFileName;
    } catch (error) {
      console.error('Error uploading file to Face API:', error);
      throw new Error('Failed to send image to face recognition backend');
    }
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
