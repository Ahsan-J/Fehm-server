import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { API } from './api.entity';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api.controller';
import { UserModule } from '../user/user.module';
import { ApiService } from './api.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([API]), UserModule],
  controllers: [ApiController],
  providers: [ApiService]
})
export class ApiModule {}
