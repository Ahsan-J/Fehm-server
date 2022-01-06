import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateBookBody } from "./book.dto";
import { BookService } from "./book.service";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthGuard, UseAccess, UseRoles } from "../auth/auth.guard";
import { UserRole } from "../user/user.enum";
import { Book } from "./book.entity";
import { APIAccessLevel } from "../apikey/api.enum";

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
    
}