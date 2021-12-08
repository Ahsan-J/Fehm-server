import { Body, Controller, Post } from "@nestjs/common";

import { AuthorService } from "./author.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Author')
@Controller('author')
export class AuthorController {
    constructor(private authorService: AuthorService) { }

    @Post('create')
    createAuthor(@Body() AuthorCreateBody): any {
        return {
            name: "Ahsan"
        }
    }
}