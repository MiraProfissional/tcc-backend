import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';
import * as FormData from 'form-data';
import axios from 'axios';
import uploadFaceApiConfig from '../config/uploadFaceApi.config';

@Injectable()
export class UploadUserFaceProvider {
  constructor(
    @Inject(uploadFaceApiConfig.KEY)
    private readonly uploadFaceApiConfiguration: ConfigType<
      typeof uploadFaceApiConfig
    >,
  ) {}

  public async sendImageToFaceRecognitionBackend(file: Express.Multer.File) {
    const newFileName = this.generateFileName(file);

    const apiLink = this.uploadFaceApiConfiguration.userFaceApiLink;
    if (!apiLink) {
      throw new Error('Face API link is not configured.');
    }

    // Cria o FormData para envio
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

  private generateFileName(file: Express.Multer.File): string {
    const name = file.originalname.split('.')[0].replace(/\s/g, '').trim();
    const extension = path.extname(file.originalname);
    const timestamp = new Date().getTime().toString().trim();
    return `${name}-${timestamp}-${uuid4()}${extension}`;
  }
}
