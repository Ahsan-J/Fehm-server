import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationMeta } from "src/helper-modules/common/common.dto";
import { CommonService } from "src/helper-modules/common/common.service";
import { FindManyOptions, Repository } from "typeorm";
import { Author } from "../author/author.entity";
import { Book } from "../book/book.entity";
import { User } from "../user/user.entity";
import { Genre } from "./genre.entity";

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private genreRepository: Repository<Genre>,
        @Inject(CommonService)
        private commonService: CommonService,
    ) {}
    
    async addGenre (genre: Array<Genre['id']>, type: User | Book | Author) {
        return
    }

    async getAll(options?: FindManyOptions<Genre>): Promise<[Genre[], PaginationMeta]> {
        const [result, count] = await this.genreRepository.findAndCount(options);
        const meta = this.commonService.generateMeta(count, options.skip, options.take);
        return [result, meta];
    }
}