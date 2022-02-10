import {  Controller, UseGuards } from "@nestjs/common";

import { ReviewService } from "./review.service";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthGuard, UseAccess, UseRoles } from "../auth/auth.guard";
import { APIAccessLevel } from "../apikey/api.enum";
import { UserRole } from "../user/user.enum";

@ApiTags('Review')
@Controller('review')
@ApiSecurity("ApiKeyAuth")
@ApiBearerAuth('AccessToken')
@UseAccess(APIAccessLevel.Standard)
@UseRoles(UserRole.User)
@UseGuards(AuthGuard)
export class ReviewController {
    constructor(private reviewService: ReviewService) { }
}