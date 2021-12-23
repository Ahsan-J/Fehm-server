import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Book } from "../book/book.entity";
import { User } from "../user/user.entity";

export class AudioBookUpload {

    @IsNotEmpty()
    @IsString()
    book_id: Book['id'];

    @IsString()
    narrator_id: User['id']
    
    @IsOptional()
    @IsString()
    description: string;
}
