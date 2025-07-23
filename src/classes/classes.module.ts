import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './providers/classes.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './class.entity';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
  imports: [UsersModule, TypeOrmModule.forFeature([Class])],
})
export class ClassesModule {}
