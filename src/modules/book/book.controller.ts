import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { CreateBookBody } from "./book.dto";
import { BookService } from "./book.service";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthGuard, UseAccess, UseRoles } from "../auth/auth.guard";
import { UserRole } from "../user/user.enum";
import { Book } from "./book.entity";
import { APIAccessLevel } from "../apikey/api.enum";
import { PaginationMeta, PaginationQuery } from "src/helper-modules/common/common.dto";
import { Sieve } from "src/helper/sieve.pipe";

@ApiTags('Book')
@ApiBearerAuth('AccessToken')
@Controller('book')
@ApiSecurity("ApiKeyAuth")
@UseAccess(APIAccessLevel.Standard)
@UseGuards(AuthGuard)
export class BookController {
    constructor(private bookService: BookService) { }

    @Post('create')
    async createBook(@Body() createBook: CreateBookBody): Promise<Book> {
        return await this.bookService.createBook(createBook);
    }

    @Get()
    async getAllBooks(@Query() query: PaginationQuery, @Query('filters', Sieve) filters, @Query('sorts', Sieve) sorts): Promise<Array<Book> | { meta: PaginationMeta }> {
        const page = parseInt(query.page);
        const pageSize = parseInt(query.pageSize || '10');

        const [data, meta] = await this.bookService.getBooks({
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