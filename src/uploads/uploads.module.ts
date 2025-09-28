import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { UploadUserFaceProvider } from './providers/upload-user-face.provider';
import { ConfigModule } from '@nestjs/config';
import uploadFaceApiConfig from './config/uploadFaceApi.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadUserFaceProvider],
  imports: [
    ConfigModule.forFeature(uploadFaceApiConfig),
    TypeOrmModule.forFeature([Upload]),
  ],
})
export class UploadsModule {}
