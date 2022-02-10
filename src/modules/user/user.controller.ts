import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import moment from 'moment';
import { PaginationMeta, PaginationQuery } from 'src/helper-modules/common/common.dto';
import { CommonService } from 'src/helper-modules/common/common.service';
import { APIAccessLevel } from '../apikey/api.enum';
import { AuthGuard, UseAccess, UseRoles } from '../auth/auth.guard';
import { Sieve } from 'src/helper/sieve.pipe';
import { RegisterBody } from '../auth/auth.dto';
import { ChangeRoleBody, UpdateUser } from './user.dto';
import { User } from './user.entity';
import { UserRole, UserStatus } from './user.enum';
import { UsersService } from './user.service';

@ApiTags('User')
@ApiSecurity("ApiKeyAuth")
@ApiBearerAuth('AccessToken')
@UseAccess(APIAccessLevel.Standard)
@UseGuards(AuthGuard)
@UseAccess(APIAccessLevel.Standard)
@Controller("user")
export class UserController {
  constructor(
    @Inject(CommonService)
    private commonService: CommonService,
    private userService: UsersService,
  ) { }

  @Get('/all')
  @UseRoles(UserRole.SuperAdmin, UserRole.Admin)
  async getUsers(@Query() query: PaginationQuery, @Query('filters', Sieve) filters,  @Query('sorts', Sieve) sorts): Promise<Array<User> | { meta: PaginationMeta }> {

    const page = parseInt(query.page);
    const pageSize = parseInt(query.pageSize || '10');
    const [data, meta] = await this.userService.getUsers({
      skip: (page - 1) * pageSize,
      take: page * pageSize,
      where: filters,
      order: sorts,
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

  @Put('change-role')
  @UseRoles(UserRole.Admin)
  async changeUserRole(@Body() body: ChangeRoleBody): Promise<User> {
    const user = await this.userService.getUserByEmail(body.email);
    user.role = this.commonService.setValue(user.role, body.role);
    return await this.userService.updateUser(user);
  }

  @Post('create')
  @UseRoles(UserRole.Admin, UserRole.SuperAdmin)
  async createUser(@Body() body: RegisterBody): Promise<User> {
    return await this.userService.createUser(body);
  }

  @Put('/:id')
  @UseRoles(UserRole.Admin, UserRole.SuperAdmin)
  async updateUser(@Body() body: UpdateUser, @Param('id') id: string): Promise<User> {
    const user = await this.userService.getUser(id);
    
    user.first_name = body.first_name || user.first_name;
    user.last_name = body.last_name || user.last_name;
    user.contact_number = body.contact_number || user.contact_number;
    user.membership_status = body.membership_status || user.membership_status;
    user.role = body.role || user.role;
    user.status = body.status || user.status;

    return await this.userService.updateUser(user);
  }

  @Delete('/:id')
  @UseRoles(UserRole.Admin, UserRole.SuperAdmin)
  async deleteUser(@Param('id') id: string, @Query('destroy') destroy: string): Promise<User> {
    const user = await this.userService.getUser(id);
    if(destroy) {
      await this.userService.destroy(user)
      return user;
    }
    user.deleted_at = moment().toISOString();
    user.status = UserStatus.Blocked;
    return await this.userService.updateUser(user); 
  }

  @Put('/:id/restore')
  @UseRoles(UserRole.Admin, UserRole.SuperAdmin)
  async restoreUser(@Param('id') id: string): Promise<User> {
    const user = await this.userService.getUser(id);
    user.deleted_at = null;
    user.status = UserStatus.InActive;
    return await this.userService.updateUser(user); 
  }
}
