import { Body, Controller, Post } from "@nestjs/common";
import { AuthorService } from "./author.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateAuthor } from "./author.dto";
import { Author } from "./author.entity";

@ApiTags('Author')
@Controller('author')
export class AuthorController {
    constructor(private authorService: AuthorService) { }

    @Post('create')
    async createAuthor(@Body() createAuthor: CreateAuthor): Promise<Author> {
        return await this.authorService.createAuthor(createAuthor);
    }
}