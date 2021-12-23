import { IsOptional, IsString, IsUrl, MinLength } from "class-validator";
import { Author } from "../author/author.entity";
import { BookGenre } from "./book_genre.entity";

export class CreateBookBody {

    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    author: Author['id'];

    @IsString()
    description: string;

    @IsString({ each: true })
    genre: Array<BookGenre['name']>;

    @IsString()
    isbn: string;

    @IsUrl()
    @IsOptional()
    purchase_url: string;
}
