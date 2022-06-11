import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './modules/apikey/api.module';
import { BookModule } from './modules/book/book.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { CommonModule } from './helper-modules/common/common.module';
import { AuthorModule } from './modules/author/author.module';
import { ReviewModule } from './modules/review/review.module';
import { AudioModule } from './modules/audio/audio.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { NotificationModule } from './modules/notification/notification.module';
import { InjectSessionUser } from './app.middleware';
import { TokenModule } from './helper-modules/token/token.module';
import { GenreModule } from './modules/genre/genre.module';
// import { SocketModule } from './helper-modules/socket/socket.module';

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
    TokenModule,
    GenreModule,
    ApiModule,
    AuthModule,
    UserModule,
    AuthorModule,
    BookModule,
    ReviewModule,
    AudioModule,
    SubscriptionModule,
    // SocketModule,
    NotificationModule,
  ],
})
export class AppModule implements NestModule {
  // constructor(private bookService: BookService) { }
  // onModuleInit() {
  //   const stream = fs.createReadStream(path.resolve(process.cwd(), "book_dump", 'ol_dump_2021-11-30.txt'));
  //   stream.on("error", (err) => {
  //     console.log(err);
  //   })
  
  //   stream.on('data', async data => {
  //     stream.pause()
  //     const temp = Buffer.from(data).toString('utf-8').split('\n').flatMap(v => v.split("\t")).filter((v: any) => {
  //       try {
  //         if (isNaN(v) && JSON.parse(v)) return true;
  //         return false;
  //       } catch (e) {
  //         return false
  //       }
  //     })

  //     for (const d of temp) {

  //       const parsed = JSON.parse(d);
  //       const key = parsed.key?.split("/");
  //       if (parsed.title && parsed.type?.key?.includes("edition") && parsed.authors?.length && (parsed.isbn_13?.length || parsed.isbn_10?.length)) {
  //         const authorKey = parsed.authors[0]?.key?.split("/")
  //         try {
  //           await this.bookService.createBook({
  //             author: authorKey[authorKey.length - 1],
  //             description: parsed.description || parsed.subtitle,
  //             isbn: parsed.isbn_10?.[0] || parsed.isbn_13?.[0],
  //             purchase_url: "https://api.fehm.local/api",
  //             title: parsed.title,
  //             genre: [],
  //             id: key[key.length - 1],
  //           });
  //         } catch (e) {
  //           // console.log()
  //         }

  //       }
  //     }
  //     stream.resume()
  //   });
  //   stream.on('end', () => {
  //     console.log("ended")
  //   })
  // }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InjectSessionUser).exclude("auth/(.*)", "public/(.*)", "audio/stream/(.*)").forRoutes("*")
  }
}
