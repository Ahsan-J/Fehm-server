import { MiddlewareConsumer, Module, NestMiddleware, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { API } from './api.entity';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { CommonModule } from 'src/helper-modules/common/common.module';
import { ApiMiddleware } from './api.middleware';

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
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware).forRoutes("*")
  }
  
}
