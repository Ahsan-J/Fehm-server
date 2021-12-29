import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommonService } from 'src/helper-modules/common/common.service';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard, UseRoles } from '../auth/auth.guard';
import { ChangeRoleBody } from './user.dto';
import { User } from './user.entity';
import { UserRole } from './user.enum';
import { UsersService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("user")
export class UserController {
  constructor(
    @Inject(CommonService)
    private commonService: CommonService,
    private userService: UsersService,
  ) { }

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
  async changeUserRole(@Body() body: ChangeRoleBody): Promise<User> {
    const user = await this.userService.getUserByEmail(body.email);
    user.role = this.commonService.setValue(user.role, body.role);
    return await this.userService.updateUser(user);
  }
}
