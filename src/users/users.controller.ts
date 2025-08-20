import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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

  @Post('/student')
  public postStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.usersService.createStudent(createStudentDto);
  }

  @Post('/teacher')
  public postTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.usersService.createTeacher(createTeacherDto);
  }

  @Patch()
  public patch(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'You sent a PATCH request';
  }

  @Delete('/student')
  public deleteStudent(@Query('id', ParseIntPipe) id: number) {
    return this.usersService.deleteStudent(id);
  }

  @Delete('/student/soft-delete')
  public softDeleteStudent(@Query('id', ParseIntPipe) id: number) {
    return this.usersService.softDeleteStudent(id);
  }

  @Delete('/teacher')
  public deleteTeacher(@Query('id', ParseIntPipe) id: number) {
    return this.usersService.deleteTeacher(id);
  }

  @Delete('/teacher/soft-delete')
  public softDeleteTeacher(@Query('id', ParseIntPipe) id: number) {
    return this.usersService.softDeleteTeacher(id);
  }
}
