import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Book } from "../book/book.entity";
import { User } from "../user/user.entity";
import { Audio } from "./audio.entity";

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

export class AudioApprove {

    @IsNotEmpty()
    @IsString()
    audio_id: Audio['id'];
}
export class AudioBlock {

    @IsNotEmpty()
    @IsString()
    audio_id: Audio['id'];

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(500)
    remark: string;
}
