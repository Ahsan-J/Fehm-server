import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { API } from './api.entity';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { CommonModule } from 'src/helper-modules/common/common.module';

@Global()
@Module({
  imports: [
    ConfigModule, 
    TypeOrmModule.forFeature([API]),
    CommonModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService]
})
export class ApiModule {}
