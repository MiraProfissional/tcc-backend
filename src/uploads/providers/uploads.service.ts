import { Injectable } from '@nestjs/common';
import { UploadUserFaceProvider } from './upload-user-face.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadUserFaceProvider: UploadUserFaceProvider,
  ) {}
  public async uploadUserFaceImage(
    file: Express.Multer.File,
    user: ActiveUserData,
  ) {
    return await this.uploadUserFaceProvider.sendImageToFaceRecognitionBackend(
      file,
      user,
    );
  }
}
