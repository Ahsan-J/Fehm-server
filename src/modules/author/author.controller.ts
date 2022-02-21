import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AuthorService } from "./author.service";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { CreateAuthor } from "./author.dto";
import { Author } from "./author.entity";
import { AuthGuard, UseAccess } from "../auth/auth.guard";
import { APIAccessLevel } from "../apikey/api.enum";
import { PaginationMeta, PaginationQuery } from "src/helper-modules/common/common.dto";
import { Sieve } from "src/helper/sieve.pipe";

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

    @Get() 
    async getAuthors(@Query() query: PaginationQuery, @Query('filters', Sieve) filters, @Query('sorts', Sieve) sorts): Promise<Array<Author> | { meta: PaginationMeta }> {
        const page = parseInt(query.page);
        const pageSize = parseInt(query.pageSize || '10');

        const [data, meta] = await this.authorService.getAuthors({
            skip: (page - 1) * pageSize,
            take: page * pageSize,
            where: filters,
            order: sorts,
        });

        return {
            ...data,
            meta
        }
    }
}