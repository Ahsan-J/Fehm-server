import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { APIAccessLevel } from '../apikey/api.enum';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard, UseAccess, UseRoles } from '../auth/auth.guard';
import { User } from '../user/user.entity';
import { UserRole } from '../user/user.enum';

@ApiTags("Notification")
@Controller('notification')
@ApiSecurity("ApiKeyAuth")
@ApiBearerAuth('AccessToken')
@UseAccess(APIAccessLevel.Standard)
@UseRoles(UserRole.User)
@UseGuards(AuthGuard)
export class NotificationController {
    @Get()
    async getUserNotification(@Headers() headers: Request['headers'], @AuthUser() user: User) : Promise<any> {
        headers.authorization
    }
}
