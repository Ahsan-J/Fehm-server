import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Author } from "../author/author.entity";
import { Book } from "../book/book.entity";
import { User } from "../user/user.entity";
import { Genre } from "./genre.entity";

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private genreRepository: Repository<Genre>,
    ) {}
    
    async addGenre (genre: Array<Genre['id']>, type: User | Book | Author) {
        return
    }

    async getAll(): Promise<Array<Genre>> {
        return this.genreRepository.find();
    }
}