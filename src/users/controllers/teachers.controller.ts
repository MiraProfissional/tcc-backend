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
import { TeachersService } from '../providers/teachers/teachers.service';
import { GetUsersParamDto } from '../dtos/users/get-users-param.dto';
import { CreateTeacherDto } from '../dtos/teachers/create-teacher.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PatchUserDto } from '../dtos/users/patch-user.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

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
    return this.teachersService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Creates a teacher on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher created succesfully',
  })
  @Post()
  public postTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.createTeacher(createTeacherDto);
  }

  @Patch()
  public patch(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'You sent a PATCH request';
  }

  @Delete()
  public deleteTeacher(@Query('id', ParseIntPipe) id: number) {
    return this.teachersService.deleteTeacherById(id);
  }

  @Delete('/soft-delete')
  public softDeleteTeacher(@Query('id', ParseIntPipe) id: number) {
    return this.teachersService.softDeleteTeacherById(id);
  }
}
