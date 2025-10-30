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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentsService } from '../providers/students/students.service';
import { GetUserParamDto } from '../dtos/users/get-users-param.dto';
import { CreateStudentDto } from '../dtos/students/create-student.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { PatchStudentDto } from '../dtos/students/patch-student.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { ActiveUser } from 'src/auth/decorators/active-user-data.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Controller('students')
@ApiTags('Students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

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
  @Get('/{:id}')
  public getStudents(
    @Param() getUserParamDto: GetUserParamDto,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.studentsService.findStudents(
      getUserParamDto,
      paginationQueryDto,
    );
  }

  @ApiOperation({
    summary: 'Creates a student on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Student created succesfully',
  })
  @Post()
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  public postStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.createStudent(createStudentDto);
  }

  @ApiOperation({
    summary: 'Updates a student on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Student updated succesfully',
  })
  @Patch()
  public patchStudent(@Body() patchStudentDto: PatchStudentDto) {
    return this.studentsService.updateStudent(patchStudentDto);
  }

  @ApiOperation({
    summary: 'Deletes a student on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Student deleted succesfully',
  })
  @Delete()
  public deleteStudent(@Query('id', ParseIntPipe) id: number) {
    return this.studentsService.deleteStudentById(id);
  }

  @ApiOperation({
    summary: 'Soft deletes a student on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Student soft deleted succesfully',
  })
  @Delete('/soft-delete')
  public softDeleteStudent(@Query('id', ParseIntPipe) id: number) {
    return this.studentsService.softDeleteStudentById(id);
  }

  @ApiOperation({
    summary: 'Changes the password of the authenticated student',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Current password is incorrect',
  })
  @Patch('/me/password')
  public changePassword(
    @ActiveUser() user: ActiveUserData,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.studentsService.changePassword(
      user.sub,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}
