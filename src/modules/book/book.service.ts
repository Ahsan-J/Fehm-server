import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { PaginationMeta } from "src/helper-modules/common/common.dto";
import { CommonService } from "src/helper-modules/common/common.service";
import { FindManyOptions, Repository } from "typeorm";
import { AuthorService } from "../author/author.service";
import { GenreService } from "../genre/genre.service";
import { CreateBookBody } from "./book.dto";
import { Book } from "./book.entity";

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
        private authorService: AuthorService,
        private genreService: GenreService,
        @Inject(CommonService)
        private commonService: CommonService
    ) { }

    async createBook(createBook: CreateBookBody): Promise<Book> {

        const author = await this.authorService.getAuthor(createBook.author);

        const isbnBook = await this.bookRepository.findOne({ where: { isbn: createBook.isbn } })

        if (isbnBook) {
            throw new BadRequestException("ISBN  already exist");
        }

        const book = await this.bookRepository.save({
            author,
            description: createBook.description,
            id: nanoid(),
            purchase_url: createBook.purchase_url,
            title: createBook.title,
            isbn: createBook.isbn,
            status: 1,
        });

        await this.genreService.addGenre(createBook.genre, book);
        await this.genreService.addGenre(createBook.genre, author);

        return book;
    }

    async getBookById(id: Book['id']): Promise<Book> {
        if (!id) throw new BadRequestException('"Book id" is missing');
        const book = await this.bookRepository.findOne(id, { relations: ['genre'] });

        if (!book) throw new BadRequestException("No Book find for specific id");
        return book;
    }

    async getBooks(options: FindManyOptions<Book>): Promise<[Book[],PaginationMeta]> {
        const [result, count] = await this.bookRepository.findAndCount(options);

        const meta = this.commonService.generateMeta(count, options.skip, options.take);

        return [result, meta]
    }

    // async addGenre(genre: UserGenre['name']): Promise<Book> {

    // }
}