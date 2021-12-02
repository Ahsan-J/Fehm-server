import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresqlModule } from './config/postgresql.module';
import { ApiModule } from './modules/apikey/api.module';
import AudioModule from './modules/audio/audio.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PostgresqlModule,
    AuthModule,
    UserModule,
    ApiModule,
    AudioModule,
  ],
})
export class AppModule {}
