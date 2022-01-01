import { Controller, Get, Query } from "@nestjs/common";
import { PaginationMeta, PaginationQuery } from "src/helper-modules/common/common.dto";
import { Genre } from "./genre.entity";
import { GenreService } from "./genre.service";
@Controller('genre')
export class GenreController {
    constructor(
        private genreService: GenreService,
    ) {}

    @Get()
    async getAllGenre(@Query() query: PaginationQuery): Promise<Array<Genre> | {meta: PaginationMeta}> {
        const page = parseInt(query.page);
        const pageSize = parseInt(query.pageSize || '10');

        const [data, meta] = await this.genreService.getAll({
            skip: (page - 1) * pageSize,
            take: page * pageSize
        });

        return {
            ...data,
            meta
        }
    }
}