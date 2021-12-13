import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { Repository } from "typeorm";
import { AuthorService } from "../author/author.service";
import { CreateBookBody } from "./book.dto";
import { Book } from "./book.entity";
import { BookGenre } from "./book_genre.entity";

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
        @InjectRepository(BookGenre)
        private bookGenreRepository: Repository<BookGenre>,
        private authorService: AuthorService,
    ) {}

    async createBook(createBook: CreateBookBody) : Promise<Book> {

        const author = await this.authorService.getAuthor(createBook.author);

        const isbnBook = await this.bookRepository.findOne({where:{ isbn: createBook.isbn }})
        
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

        for(const genre of createBook.genre) {
            if (!author.genre.find(g => g.name == genre)) {
                await this.authorService.addGenre(author, genre)
            }

            await this.bookGenreRepository.save({
                name: genre,
                book,
            })
        }

        return book;
    }

    // async addGenre(genre: UserGenre['name']): Promise<Book> {

    // }
}