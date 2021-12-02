import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { API } from './api.entity';
import { ConfigModule } from '@nestjs/config';
import { APIMiddleware } from './api.middleware';
import { ApiController } from './api.controller';
import { UserModule } from '../user/user.module';
import { ApiService } from './api.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([API]), UserModule],
  controllers: [ApiController],
  providers: [ApiService]
})
export class ApiModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(APIMiddleware).forRoutes({path: "*", method:RequestMethod.ALL})
    }
    
}
