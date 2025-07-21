import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    const newUser = this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(newUser);
  }

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
