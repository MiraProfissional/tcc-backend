import { registerAs } from '@nestjs/config';

export default registerAs('cameraApiConfig', () => ({
  apiLink: process.env.CAMERA_API_LINK,
}));
