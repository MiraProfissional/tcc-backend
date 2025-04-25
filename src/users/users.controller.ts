import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';

@Controller('users')
export class UsersController {
  @Get('/{:id}')
  public getUsers(@Param() getUsersParamDto?: GetUsersParamDto) {
    console.log(getUsersParamDto);
    return 'You sent a GET request';
  }

  @Post()
  public postUsers(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto instanceof CreateUserDto);
    return 'You sent a POST request';
  }

  @Patch()
  public patchUsers(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'You sent a PATCH request';
  }
}
