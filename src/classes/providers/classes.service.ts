import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreateClassDto } from '../dtos/create-class.dto';
import { Repository } from 'typeorm';
import { Class } from '../class.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClassesService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Class)
    private classesRepository: Repository<Class>,
  ) {}

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

  public async createClass(createClassDto: CreateClassDto) {
    const newClass = this.classesRepository.create(createClassDto);
    return await this.classesRepository.save(newClass);
  }
}
