import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TeachersService } from '../providers/teachers/teachers.service';
import { GetUsersParamDto } from '../dtos/users/get-users-param.dto';
import { CreateTeacherDto } from '../dtos/teachers/create-teacher.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { PatchTeacherDto } from '../dtos/teachers/patch-teacher.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

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
  @Get('/{:id}')
  public get(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.teachersService.findTeachers(
      getUsersParamDto,
      paginationQueryDto,
    );
  }

  @ApiOperation({
    summary: 'Creates a teacher on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher created succesfully',
  })
  @Post()
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  public postTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.createTeacher(createTeacherDto);
  }

  @ApiOperation({
    summary: 'Updates a teacher on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher updated succesfully',
  })
  @Patch()
  public patch(@Body() patchTeacherDto: PatchTeacherDto) {
    console.log(patchTeacherDto);
    return 'You sent a PATCH request';
  }

  @ApiOperation({
    summary: 'Deletes a teacher on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher deleted succesfully',
  })
  @Delete()
  public deleteTeacher(@Query('id', ParseIntPipe) id: number) {
    return this.teachersService.deleteTeacherById(id);
  }

  @ApiOperation({
    summary: 'Soft deletes a teacher on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher soft deleted succesfully',
  })
  @Delete('/soft-delete')
  public softDeleteTeacher(@Query('id', ParseIntPipe) id: number) {
    return this.teachersService.softDeleteTeacherById(id);
  }
}
