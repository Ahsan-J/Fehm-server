import {  ClassSerializerInterceptor, Controller, UseInterceptors } from "@nestjs/common";

import { AuthorService } from "./author.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Author')
@Controller('author')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthorController {
    constructor(private authorService: AuthorService) { }
}