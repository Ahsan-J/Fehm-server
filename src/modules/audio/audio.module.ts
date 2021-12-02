import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { Audio } from './audio.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
    imports:[
        ConfigModule, 
        TypeOrmModule.forFeature([Audio]),
        UserModule
    ],
    providers: [AudioService],
    exports: [AudioService],
    controllers: [AudioController],
})
export default class AudioModule {}