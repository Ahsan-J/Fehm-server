import { BadRequestException, ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { Repository } from "typeorm";
import { Genre } from "../genre/genre.entity";
import { GenreService } from "../genre/genre.service";
import { CreateAuthor } from "./author.dto";
import { Author } from "./author.entity";

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Author)
        private authorRepository: Repository<Author>,
        private genreService: GenreService,
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
            throw new ConflictException("Author already exist");
        }
        
        return await this.authorRepository.save({
            name: createAuthor.name,
            bio: createAuthor.bio,
            url: createAuthor.url,
            id: nanoid(),
        })
    }

    async addGenre(author: Author, genre: Genre['name']) {
        return await this.genreService.addGenre([], author);
    }
}