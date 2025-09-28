import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './providers/uploads.service';
import { ApiHeaders, ApiOperation } from '@nestjs/swagger';
import { Express } from 'express';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseInterceptors(FileInterceptor('file'))
  @ApiHeaders([
    { name: 'Content-Type', description: 'multipart/form-data' },
    { name: 'Authorization', description: 'Bearer Token' },
  ])
  @ApiOperation({
    summary: 'Upload a user face image to the face-recognition server',
  })
  @Post('user-face')
  public uploadUserFaceImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadUserFaceImage(file);
  }
}
