import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './modules/apikey/api.module';
import { BookModule } from './modules/book/book.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { CommonModule } from './helper-modules/common/common.module';
import { AuthorModule } from './modules/author/author.module';
import { ReviewModule } from './modules/review/review.module';

const databaseConfiguration: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    "type": "mysql",
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
    CommonModule,
    AuthModule,
    UserModule,
    ApiModule,
    AuthorModule,
    BookModule,
    ReviewModule,
  ],
})
export class AppModule { }
