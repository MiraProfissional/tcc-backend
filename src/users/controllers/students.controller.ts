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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentsService } from '../providers/students/students.service';
import { GetUsersParamDto } from '../dtos/users/get-users-param.dto';
import { CreateStudentDto } from '../dtos/students/create-student.dto';
import { PatchUserDto } from '../dtos/users/patch-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('students')
@ApiTags('Students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('/{:id}')
  @ApiOperation({
    summary: 'Fetches a list of registered students on the application',
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
  public getStudents(@Param() getUsersParamDto?: GetUsersParamDto) {
    console.log(getUsersParamDto);
    return this.studentsService.findAll();
  }

  @Post()
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Creates a student on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Student created succesfully',
  })
  public postStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.createStudent(createStudentDto);
  }

  @Patch()
  public patchStudent(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'You sent a PATCH request';
  }

  @Delete()
  public deleteStudent(@Query('id', ParseIntPipe) id: number) {
    return this.studentsService.deleteStudentById(id);
  }

  @Delete('/soft-delete')
  public softDeleteStudent(@Query('id', ParseIntPipe) id: number) {
    return this.studentsService.softDeleteStudentById(id);
  }
}
