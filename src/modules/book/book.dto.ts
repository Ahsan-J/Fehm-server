import {  IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from "class-validator";
import { Author } from "../author/author.entity";
import { User } from "../user/user.entity";
import { Book } from "./book.entity";
import { FictionGenre, NonFictionGenre } from "./book.enum";
import { Genre } from "./genre.entity";

export class AudioBookUploadBody {

    @IsNotEmpty()
    @IsString()
    book_id: Book['id'];

    @IsString()
    narrator_id: User['id']
    
    @IsOptional()
    @IsString()
    description: Book['description'];

    @IsOptional()
    genre: Array<Genre['id']>;

    @IsString()
    @IsUrl()
    audio_url: string;
}

export class CreateBookBody {

    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    author: Author['id'];

    @IsString()
    description: string;

    @IsString({ each: true })
    genre: Array<Genre['id']>;

    @IsString()
    isbn: string;

    @IsUrl()
    @IsOptional()
    purchase_url: string;
}
