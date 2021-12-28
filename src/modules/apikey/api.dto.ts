import { IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAccessKey {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    access_level: number;
}

export class UpdateAccessKey {
    @IsOptional()
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    description: string;
  
    @IsString()
    @IsOptional()
    @IsISO8601()
    expiry_at: string;
  
    @IsOptional()
    @IsNumber()
    access_level: number;
}