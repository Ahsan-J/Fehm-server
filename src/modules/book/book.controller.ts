import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { CreateBookBody } from "./book.dto";
import { BookService } from "./book.service";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthGuard, UseAccess, UseRoles } from "../auth/auth.guard";
import { UserRole } from "../user/user.enum";
import { Book } from "./book.entity";
import { APIAccessLevel } from "../apikey/api.enum";
import { PaginationMeta, PaginationQuery } from "src/helper-modules/common/common.dto";

@ApiTags('Book')
@ApiBearerAuth('AccessToken')
@Controller('book')
@ApiSecurity("ApiKeyAuth")
@UseAccess(APIAccessLevel.Standard)
@UseGuards(AuthGuard)
export class BookController {
    constructor(private bookService: BookService) { }

    @Post('create')
    @UseRoles(UserRole.Admin, UserRole.SuperAdmin)
    createBook(@Body() createBook: CreateBookBody): Promise<Book> {
        return this.bookService.createBook(createBook);
    }

    @Get('all')
    @UseRoles(UserRole.User, UserRole.Admin, UserRole.SuperAdmin)
    async getAllBooks(@Query() query: PaginationQuery): Promise<Array<Book> | { meta: PaginationMeta }> {
        const page = parseInt(query.page);
        const pageSize = parseInt(query.pageSize || '10');

        const [data, meta] = await this.bookService.getBooks({
            skip: (page - 1) * pageSize,
            take: page * pageSize
        });

        return {
            ...data,
            meta
        }
    }

}