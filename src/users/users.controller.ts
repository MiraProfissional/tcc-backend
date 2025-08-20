import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/users/create-user.dto';
import { GetUsersParamDto } from './dtos/users/get-users-param.dto';
import { PatchUserDto } from './dtos/users/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from './dtos/students/create-student.dto';
import { CreateTeacherDto } from './dtos/teachers/create-teacher.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/{:id}')
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched succesfully based on the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'The position of the page that you want the API to return',
    example: 1,
  })
  public get(@Param() getUsersParamDto?: GetUsersParamDto) {
    console.log(getUsersParamDto);
    return this.usersService.findAll();
  }

  @Post('/aluno')
  public postStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.usersService.createStudent(createStudentDto);
  }

  @Post('/professor')
  public postTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.usersService.createTeacher(createTeacherDto);
  }

  @Patch()
  public patch(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'You sent a PATCH request';
  }
}
