import { registerAs } from '@nestjs/config';

export default registerAs('uploadFaceApiConfig', () => ({
  userFaceApiLink: process.env.UPLOAD_FACE_API_LINK,
}));
