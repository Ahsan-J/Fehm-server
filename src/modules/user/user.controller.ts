import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PaginationMeta, PaginationQuery } from 'src/helper-modules/common/common.dto';
import { CommonService } from 'src/helper-modules/common/common.service';
import { AuthGuard, UseRoles } from '../auth/auth.guard';
import { ChangeRoleBody } from './user.dto';
import { User } from './user.entity';
import { UserRole } from './user.enum';
import { UsersService } from './user.service';

@ApiTags('User')
@ApiSecurity("ApiKeyAuth")
@ApiBearerAuth('AccessToken')
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
  async getUsers(@Query() query: PaginationQuery): Promise<Array<User> | { meta: PaginationMeta }> {
    const page = parseInt(query.page);
    const pageSize = parseInt(query.pageSize || '10');

    const [data, meta] = await this.userService.getUsers({
      skip: (page - 1) * pageSize,
      take: page * pageSize
    });

    return {
      ...data,
      meta
    }
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
