import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationMeta } from "src/helper-modules/common/common.dto";
import { CommonService } from "src/helper-modules/common/common.service";
import { FindManyOptions, Repository } from "typeorm";
import { Genre } from "./genre.entity";

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private genreRepository: Repository<Genre>,
        @Inject(CommonService)
        private commonService: CommonService,
    ) {}

    async getGenre (genreId: Genre['id']): Promise<Genre>{
        if(!genreId) {
            throw new BadRequestException("Genre Id is empty");
        }

        const genre = await this.genreRepository.findOne(genreId)

        if(!genre) {
            throw new NotFoundException("No Genre found for given id");
        }

        return genre;
    }

    async getAll(options?: FindManyOptions<Genre>): Promise<[Genre[], PaginationMeta]> {
        const [result, count] = await this.genreRepository.findAndCount(options);
        const meta = this.commonService.generateMeta(count, options.skip, options.take);
        return [result, meta];
    }
}