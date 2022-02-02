import { Controller, Get, Query } from "@nestjs/common";
import { ApiSecurity } from "@nestjs/swagger";
import { PaginationMeta, PaginationQuery } from "src/helper-modules/common/common.dto";
import { APIAccessLevel } from "../apikey/api.enum";
import { UseAccess } from "../auth/auth.guard";
import { Genre } from "./genre.entity";
import { GenreService } from "./genre.service";

@ApiSecurity("ApiKeyAuth")
@UseAccess(APIAccessLevel.Standard)
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