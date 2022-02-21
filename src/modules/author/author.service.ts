import { BadRequestException, ConflictException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { FindManyOptions, Repository } from "typeorm";
import { GenreService } from "../genre/genre.service";
import { CreateAuthor } from "./author.dto";
import { Author } from "./author.entity";
import moment from 'moment';
import { PaginationMeta } from "src/helper-modules/common/common.dto";
import { CommonService } from "src/helper-modules/common/common.service";

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Author)
        private authorRepository: Repository<Author>,
        private genreService: GenreService,
        @Inject(CommonService)
        private commonService: CommonService,
    ) { }

    async getAuthorById(id: Author['id']): Promise<Author> {
        if (!id) {
            throw new BadRequestException("No id provided to fetch the author");
        }

        const author = await this.authorRepository.findOne(id, {relations:['genre', 'books']});

        if(!author) {
            throw new BadRequestException("Author not found")
        }

        return author;
    }

    async getAuthors(options: FindManyOptions<Author>):  Promise<[Author[],PaginationMeta]>{
        const [result, count] = await this.authorRepository.findAndCount({
            relations: ['books'],
            ...options
        });

        const meta = this.commonService.generateMeta(count, options.skip, options.take);

        return [result, meta]
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
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
        })
    }
}