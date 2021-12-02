import {  Module  } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../cache/cache.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ 
    RedisModule,
    ConfigModule, 
    UserModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
