import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response, Request } from "express";
import { createReadStream, stat } from "fs";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { AudioBookUploadBody, CreateBookBody } from "./book.dto";
import { BookService } from "./book.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateReadStreamOptions } from "fs/promises";
import { AuthGuard, UseRoles } from "../auth/auth.guard";
import { UserRole } from "../user/user.enum";
import { Book } from "./book.entity";

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
    }
})

@ApiTags('Book')
@ApiBearerAuth()
@Controller('book')
@UseGuards(AuthGuard)
export class BookController {
    constructor(private bookService: BookService) { }

    @Post('create')
    @UsePipes(ValidationPipe)
    @UseRoles(UserRole.Admin, UserRole.SuperAdmin)
    createBook(@Body() createBook: CreateBookBody): Promise<Book> {
        return this.bookService.createBook(createBook);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('book', { storage }))
    @UsePipes(ValidationPipe)
    uploadBook(@Body() uploadBody: AudioBookUploadBody, @UploadedFile() file: Express.Multer.File): any {
        return file.filename;
    }

    @Get('stream/:filename')
    streamBook(@Param('filename') filename, @Res() res: Response, @Headers() headers: Request['headers']) {
        if (!filename) throw new BadRequestException("Filename cannot be empty");
        const filePath = join(process.cwd(), 'uploads', `${filename}`);
        stat(filePath, (err, stat) => {
            if (err) {
                const be = new BadRequestException("Requested file not found");
                return res.status(be.getStatus()).json(be.getResponse())
            }

            let code = 200;

            const opts: CreateReadStreamOptions = {
                start: 0,
                end: stat.size
            };

            const sendingHeaders = {
                'Content-Type': 'audio/mpeg',
                'Accept-Ranges': 'bytes',
                'Content-Length': stat.size,
                "Last-Modified": stat.mtime.toUTCString()
            }

            if (headers.range) {
                code = 206;
                
                const [, , startingRange, endingRange] = /(\w*)=(\d*)-(\d*)/.exec(headers.range);
                opts.end = parseInt(endingRange, 10) || (stat.size - 1);
                opts.start = parseInt(startingRange, 10) || 0;

                sendingHeaders["Content-Range"] = `bytes ${opts.start}-${opts.end}/${stat.size}`;
                sendingHeaders["Content-Length"] = opts.end - opts.start + 1;

                if (opts.start >= stat.size || opts.end >= stat.size) { 
                    //exceeding range limit and end on proper status code
                    res.setHeader("Content-Range", `bytes */${stat.size}`);
                    return res.status(416).end();
                }
            }

            const file = createReadStream(filePath, opts);
            res.status(code).set(sendingHeaders);
            file.pipe(res);
        })
    }
}