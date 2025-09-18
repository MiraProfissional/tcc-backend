import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardmap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;
  constructor(
    private readonly reflector: Reflector,

    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardmap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const guards = authTypes
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      .map((type: any) => this.authTypeGuardmap[type])
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .flat();

    const error = new UnauthorizedException();

    let canActivate = false;

    for (const instance of guards) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      canActivate = await Promise.resolve(instance.canActivate(context)).catch(
        (err) => {
          throw err;
        },
      );

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
