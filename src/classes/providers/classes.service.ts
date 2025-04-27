import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class ClassesService {
  constructor(private readonly usersService: UsersService) {}

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user: user,
        name: 'Teste 1',
        code: 1,
      },
      {
        user: user,
        name: 'Teste 2',
        code: 2,
      },
    ];
  }
}
