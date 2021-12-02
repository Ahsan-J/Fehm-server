import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "../user/user.entity";

export class AccessKeyBody {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    access_level: number;

    @IsNotEmpty()
    @IsString()
    user_id: User['id'];
}
