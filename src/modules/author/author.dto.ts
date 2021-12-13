import { IsAlpha, IsAlphanumeric, IsNotEmpty, IsString, IsUrl, MinLength } from "class-validator";
import { Author } from "./author.entity";

export class CreateAuthor {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @IsAlpha()
    name: Author['name'];

    @IsString()
    @IsAlphanumeric()
    bio: Author['bio'];

    @IsString()
    @IsUrl()
    url: Author['url'];
}