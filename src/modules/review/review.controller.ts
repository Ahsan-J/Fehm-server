import {  Controller } from "@nestjs/common";

import { ReviewService } from "./review.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Review')
@Controller('review')
export class ReviewController {
    constructor(private reviewService: ReviewService) { }
}