import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { User } from "../user/user.entity";
import { UserGenre } from "../user/user_genre.entity";

export class LoginBody {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email'];

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: User['password'];
}

export class RegisterBody {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email'];

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    first_name: User['first_name'];
    
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    last_name: User['last_name'];

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: User['password'];

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    confirm_password: User['password'];

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    contact_number: User['contact_number'];

    @IsArray()
    genre: Array<UserGenre['name']>
}

export class ResetPasswordBody {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email']

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    confirm_password: string;
}

export class ForgotPasswordBody {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: User['email']
}

export class HeaderParams {
    
    @IsNotEmpty()
    @IsString()
    "x-api-key": string;

    @IsNotEmpty()
    @IsString()
    "user-agent": string;
}

export class ActivateUserBody {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    id: User['id']
}