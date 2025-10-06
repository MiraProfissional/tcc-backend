import { registerAs } from '@nestjs/config';

export default registerAs('faceRecognitionApiConfig', () => ({
  startFaceRecognitionApiLink: process.env.START_FACE_RECOGNITION_API_LINK,
  stopFaceRecognitionApiLink: process.env.STOP_FACE_RECOGNITION_API_LINK,
}));
