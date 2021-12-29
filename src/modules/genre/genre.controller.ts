import { Controller, Get } from "@nestjs/common";
import { Genre } from "./genre.entity";
import { GenreService } from "./genre.service";

@Controller('genre')
export class GenreController {
    constructor(
        private genreService: GenreService,
    ) {}

    @Get()
    async getAllGenre(): Promise<Array<Genre>> {
        return await this.genreService.getAll();
    }
}