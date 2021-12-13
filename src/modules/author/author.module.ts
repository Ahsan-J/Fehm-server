import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { ConfigModule } from '@nestjs/config';
import { Author } from './author.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorGenre } from './author_genre.entity';

@Module({
    imports:[
        ConfigModule, 
        TypeOrmModule.forFeature([Author, AuthorGenre]),
    ],
    providers: [AuthorService],
    exports: [AuthorService],
    controllers: [AuthorController],
})
export class AuthorModule {}