import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // @Put(':id/update')
  // update(
  //   @Param('id') id: string,
  //   @Body()
  //   updateUserDto: UpdateUserDto,
  // ) {
  //   return this.userService.updateUser(updateUserDto, id);
  // }
}
