import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ForgotPasswordProvider } from '../providers/forgot-password.provider';
import { ValidateResetTokenProvider } from '../providers/validate-reset-token.provider';
import { ResetPasswordProvider } from '../providers/reset-password.provider';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('password')
@ApiTags('Password Reset')
export class PasswordController {
  constructor(
    private readonly forgotPasswordProvider: ForgotPasswordProvider,
    private readonly validateResetTokenProvider: ValidateResetTokenProvider,
    private readonly resetPasswordProvider: ResetPasswordProvider,
  ) {}

  @Post('forgot-password')
  @Auth(AuthType.None)
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.forgotPasswordProvider.forgotPassword(forgotPasswordDto.email);
  }

  @Get('validate-token/{:token}')
  @Auth(AuthType.None)
  @ApiOperation({ summary: 'Validate password reset token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 400, description: 'Token is invalid or expired' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  public async validateToken(@Param('token') token: string) {
    return this.validateResetTokenProvider.validateToken(token);
  }

  @Post('reset-password')
  @Auth(AuthType.None)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token or weak password' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.resetPasswordProvider.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
