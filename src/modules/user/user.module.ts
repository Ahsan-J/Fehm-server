import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserGenre } from './user_genre.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, UserGenre])],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService]
})
export class UserModule {}
