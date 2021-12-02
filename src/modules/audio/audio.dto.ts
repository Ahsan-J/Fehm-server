import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Audio } from "./audio.entity";

export class AudioUploadBody {

    @IsNotEmpty()
    @IsString()
    title: Audio['title'];

    @IsNotEmpty()
    @IsString()
    author: Audio['author'];

    @IsNotEmpty()
    @IsString()
    narrator: Audio['narrator'];
    
    @IsOptional()
    @IsString()
    description: Audio['description'];
}
