import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { Repository } from "typeorm";
import { CreateAuthor } from "./author.dto";
import { Author } from "./author.entity";
import { AuthorGenre } from "./author_genre.entity";

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Author)
        private authorRepository: Repository<Author>,
        @InjectRepository(AuthorGenre)
        private authorGenreRepository: Repository<AuthorGenre>,
    ) { }

    async getAuthor(id: Author['id']): Promise<Author> {
        if (!id) {
            throw new BadRequestException("No id provided to fetch the author");
        }

        const author = await this.authorRepository.findOne(id, {relations:['genre', 'books']});

        if(!author) {
            throw new BadRequestException("Author not found")
        }

        return author;
    }

    async createAuthor(createAuthor: CreateAuthor): Promise<Author> {

        if(await this.authorRepository.findOne({where:{name: createAuthor.name}})){
            throw new ForbiddenException("Author already exist");
        }
        
        return await this.authorRepository.save({
            name: createAuthor.name,
            bio: createAuthor.bio,
            url: createAuthor.url,
            id: nanoid(),
        })
    }

    async addGenre(author: Author, genre: AuthorGenre['name']): Promise<AuthorGenre> {
        return await this.authorGenreRepository.save({
            author,
            name: genre,
        });
    }
}