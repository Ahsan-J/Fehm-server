import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { APIAccessLevel } from '../apikey/api.enum';
import { AuthGuard, UseAccess } from '../auth/auth.guard';

@ApiTags('Subscription')
@Controller('subscription')
@ApiBearerAuth('AccessToken')
@ApiSecurity("ApiKeyAuth")
@UseAccess(APIAccessLevel.Standard)
@UseGuards(AuthGuard)
export class SubscriptionController {}
