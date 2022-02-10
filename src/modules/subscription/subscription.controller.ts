import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { APIAccessLevel } from '../apikey/api.enum';
import { AuthGuard, UseAccess, UseRoles } from '../auth/auth.guard';
import { UserRole } from '../user/user.enum';

@ApiTags('Subscription')
@Controller('subscription')
@ApiBearerAuth('AccessToken')
@ApiSecurity("ApiKeyAuth")
@UseAccess(APIAccessLevel.Standard)
@UseGuards(AuthGuard)
@UseRoles(UserRole.User)
export class SubscriptionController {}
