import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';

@Module({
    imports:[
        ConfigModule, 
        TypeOrmModule.forFeature([Review]),
    ],
    providers: [ReviewService],
    exports: [ReviewService],
    controllers: [ReviewController],
})
export class ReviewModule {}