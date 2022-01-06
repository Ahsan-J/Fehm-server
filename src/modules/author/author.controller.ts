import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthorService } from "./author.service";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { CreateAuthor } from "./author.dto";
import { Author } from "./author.entity";
import { AuthGuard, UseAccess } from "../auth/auth.guard";
import { APIAccessLevel } from "../apikey/api.enum";

@ApiTags('Author')
@Controller('author')
@ApiSecurity("ApiKeyAuth")
@ApiBearerAuth('AccessToken')
@UseAccess(APIAccessLevel.Standard)
@UseGuards(AuthGuard)
export class AuthorController {
    constructor(private authorService: AuthorService) { }

    @Post('create')
    async createAuthor(@Body() createAuthor: CreateAuthor): Promise<Author> {
        return await this.authorService.createAuthor(createAuthor);
    }
}