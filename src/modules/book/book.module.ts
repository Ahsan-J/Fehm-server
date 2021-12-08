import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { Genre } from './genre.entity';

@Module({
    imports:[
        ConfigModule, 
        TypeOrmModule.forFeature([Book, Genre]),
        UserModule
    ],
    providers: [BookService],
    exports: [BookService],
    controllers: [BookController],
})
export default class BookModule {}