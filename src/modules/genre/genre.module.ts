import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GenreController } from "./genre.controller";
import { Genre } from "./genre.entity";
import { GenreService } from "./genre.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([Genre])
    ],
    controllers: [GenreController],
    exports: [GenreService],
    providers: [GenreService]
})
export class GenreModule {}