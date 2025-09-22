import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { UserRole } from 'src/users/enums/user-role.enum';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService,
  ) {}

  public async signToken<T>(
    userId: number,
    userRole: UserRole,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        role: userRole,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }

  public async generateTokens(user: Student | Teacher) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        user.userRole,
        this.jwtConfiguration.refreshTokenTtl,
        {
          email: user.email,
        },
      ),

      this.signToken(
        user.id,
        user.userRole,
        this.jwtConfiguration.refreshTokenTtl,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
