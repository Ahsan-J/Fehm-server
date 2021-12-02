import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { UsersService } from './user.service';

@ApiTags('User')
@Controller("user")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UsersService) {}

  @Get('/all')
  getUsers(): Promise<Array<User>> {
    return this.userService.getUsers();
  }
  
  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }

}
