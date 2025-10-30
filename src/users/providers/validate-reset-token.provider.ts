import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from '../entities/password-reset-token.entity';

@Injectable()
export class ValidateResetTokenProvider {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly resetTokenRepository: Repository<PasswordResetToken>,
  ) {}

  public async validateToken(token: string): Promise<{ valid: boolean }> {
    const resetToken = await this.resetTokenRepository.findOne({
      where: { token },
    });

    if (!resetToken) {
      throw new NotFoundException('Invalid or expired reset token.');
    }

    if (resetToken.used) {
      throw new BadRequestException('This reset token has already been used.');
    }

    if (new Date() > resetToken.expiresAt) {
      throw new BadRequestException('This reset token has expired.');
    }

    return { valid: true };
  }
}
