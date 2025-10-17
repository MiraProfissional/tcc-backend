import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @ApiOperation({
    summary:
      'Try to sign in a user on the application by Google authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
  })
  @Post()
  public authenticate(@Body() googleTokeDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(googleTokeDto);
  }
}
