import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public findAll() {
    const auth = this.authService.isAuth();
    console.log(auth);

    return [
      {
        name: 'Joao',
        email: 'joao@email.com',
      },
      {
        name: 'Gustavo',
        email: 'gustavo@email.com',
      },
    ];
  }

  public findOneById(userId: string) {
    return {
      name: 'User 1',
      email: 'user1@email.com',
    };
  }
}
