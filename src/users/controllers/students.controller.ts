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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { Student } from '../entities/student.entity';

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
    summary:
      'Creates a student with face image upload (transactional - student only created if face upload succeeds)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description:
      'Student created successfully with face image uploaded to face recognition system',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or face image missing',
  })
  @ApiResponse({
    status: 408,
    description:
      'Face upload to Python backend failed - student creation rolled back',
  })
  @Post('with-face')
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('faceImage'))
  public async postStudentWithFace(
    @Body() createStudentDto: CreateStudentDto,
    @UploadedFile() faceImage: Express.Multer.File,
  ): Promise<Student> {
    return await this.studentsService.createStudentWithFace(
      createStudentDto,
      faceImage,
    );
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
