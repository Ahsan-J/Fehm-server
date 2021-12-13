import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { BookGenre } from './book_genre.entity';
import { AuthorModule } from '../author/author.module';

@Module({
    imports:[
        ConfigModule, 
        TypeOrmModule.forFeature([Book, BookGenre]),
        UserModule,
        AuthorModule
    ],
    providers: [BookService],
    exports: [BookService],
    controllers: [BookController],
})
export class BookModule {}