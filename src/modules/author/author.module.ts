import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { ConfigModule } from '@nestjs/config';
import { Author } from './author.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports:[
        ConfigModule, 
        TypeOrmModule.forFeature([Author]),
    ],
    providers: [AuthorService],
    exports: [AuthorService],
    controllers: [AuthorController],
})
export class AuthorModule {}