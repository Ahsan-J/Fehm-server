import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Param, Post, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonService } from 'src/helper-modules/common/common.service';
import { AuthGuard, UseRoles } from '../auth/auth.guard';
import { ChangeRoleBody } from './user.dto';
import { User } from './user.entity';
import { UserRole } from './user.enum';
import { UsersService } from './user.service';

@ApiTags('User')
@UseGuards(AuthGuard)
@Controller("user")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    @Inject(CommonService)
    private commonService: CommonService,
    private userService: UsersService,
    ) {}

  @Get('/all')
  @UseRoles(UserRole.SuperAdmin, UserRole.Admin)
  getUsers(): Promise<Array<User>> {
    return this.userService.getUsers();
  }
  
  @Get('/:id')
  @UseRoles(UserRole.SuperAdmin, UserRole.Admin, UserRole.User)
  async getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @Post('change-role')
  @UseRoles(UserRole.Admin)
  @UsePipes(ValidationPipe)
  async changeUserRole (@Body() body: ChangeRoleBody): Promise<User> {
    const user = await this.userService.getUserByEmail(body.email);
    user.role = this.commonService.setValue(user.role, body.role);    
    return await this.userService.updateUser(user);
  }

}
