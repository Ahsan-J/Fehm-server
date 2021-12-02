import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './modules/apikey/api.module';
import AudioModule from './modules/audio/audio.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";

const databaseConfiguration: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    "type": "postgres",
    "host": configService.get('DATABASE_HOST'),
    "port": parseInt(configService.get('DATABASE_PORT')),
    "username": configService.get('DATABASE_USER'),
    "password": configService.get('DATABASE_PASS'),
    "database": configService.get('DATABASE_NAME'),
    "synchronize": true,
    "autoLoadEntities": true,
  }),
  inject: [ConfigService]
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(databaseConfiguration),
    AuthModule,
    UserModule,
    ApiModule,
    AudioModule,
  ],
})
export class AppModule { }
