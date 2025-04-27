import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './providers/classes.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
  imports: [UsersModule],
})
export class ClassesModule {}
