import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../../helper-modules/cache/cache.module';
import { MailModule } from '../../helper-modules/mail/mail.module';
import { ApiModule } from '../apikey/api.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthAPIKeyMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';

@Module({
  imports: [ 
    RedisModule,
    ConfigModule,
    ApiModule,
    UserModule,
    MailModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAPIKeyMiddleware).forRoutes(AuthController)
  }
}
