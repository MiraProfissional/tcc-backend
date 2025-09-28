import { Injectable } from '@nestjs/common';
import { UploadUserFaceProvider } from './upload-user-face.provider';

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadUserFaceProvider: UploadUserFaceProvider,
  ) {}
  public async uploadUserFaceImage(file: Express.Multer.File) {
    return await this.uploadUserFaceProvider.sendImageToFaceRecognitionBackend(
      file,
    );
  }
}
