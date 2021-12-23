import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from '../book/book.module';
import { UserModule } from '../user/user.module';
import { AudioController } from './audio.controller';
import { Audio } from './audio.entity';
import { AudioService } from './audio.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Audio]),
    BookModule,
    UserModule,
  ],
  controllers: [AudioController],
  exports: [AudioService],
  providers: [AudioService]
})
export class AudioModule {}
