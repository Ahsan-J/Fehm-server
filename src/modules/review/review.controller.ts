import {  Controller, UseGuards } from "@nestjs/common";

import { ReviewService } from "./review.service";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard, UseAccess } from "../auth/auth.guard";
import { APIAccessLevel } from "../apikey/api.enum";

@ApiTags('Review')
@Controller('review')
@UseAccess(APIAccessLevel.Standard)
@UseGuards(AuthGuard)
export class ReviewController {
    constructor(private reviewService: ReviewService) { }
}