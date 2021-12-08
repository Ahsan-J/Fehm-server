import {  ClassSerializerInterceptor, Controller, UseInterceptors } from "@nestjs/common";

import { ReviewService } from "./review.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Author')
@Controller('author')
@UseInterceptors(ClassSerializerInterceptor)
export class ReviewController {
    constructor(private reviewService: ReviewService) { }
}