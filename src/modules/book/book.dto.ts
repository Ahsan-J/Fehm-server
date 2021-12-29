import { IsOptional, IsString, IsUrl, MinLength } from "class-validator";
import { Author } from "../author/author.entity";
import { Genre } from "../genre/genre.entity";

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
