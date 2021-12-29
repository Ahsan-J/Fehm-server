import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { ConfigModule } from '@nestjs/config';
import { Author } from './author.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreModule } from '../genre/genre.module';

@Module({
    imports:[
        ConfigModule, 
        TypeOrmModule.forFeature([Author]),
        GenreModule,
    ],
    providers: [AuthorService],
    exports: [AuthorService],
    controllers: [AuthorController],
})
export class AuthorModule {}