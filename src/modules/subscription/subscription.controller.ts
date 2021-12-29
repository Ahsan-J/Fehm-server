import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { APIAccessLevel } from '../apikey/api.enum';
import { AuthGuard, UseAccess } from '../auth/auth.guard';

@ApiTags('Subscription')
@Controller('subscription')
@UseAccess(APIAccessLevel.Standard)
@UseGuards(AuthGuard)
export class SubscriptionController {}
