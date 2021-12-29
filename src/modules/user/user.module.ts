import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    GenreModule
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService]
})
export class UserModule {}
