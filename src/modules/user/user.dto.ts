import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Genre } from "../genre/genre.entity";
import { User } from "../user/user.entity";
import { UserRole } from "./user.enum";

export class ChangeRoleBody {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email'];

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: User['role'];
}

export class UpdateUser {
    @IsOptional()
    first_name: User['first_name'];

    @IsOptional()
    last_name: User['last_name'];

    @IsOptional()
    contact_number: User['contact_number'];

    @IsOptional()
    membership_status: User['membership_status']

    @IsOptional()
    role: User['role'];

    @IsOptional()
    status: User['status'];
}

export class AddGenre {
    @IsArray()
    genre: Array<Genre['id']>
}