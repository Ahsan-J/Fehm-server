import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session from 'express-session';
import { TransformInterceptor } from './helper/response.interceptor';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.useStaticAssets(join(process.cwd(), 'uploads', 'profile'), {prefix: "/profile/"});
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());
  // app.enableCors();

  const configService = app.get(ConfigService);
  // const user = await app.get(UsersService).createUser({
  //   email: 'xcalaiberz@gmail.com',
  //   last_name: "Ahmed",
  //   first_name: "Ahsan",
  //   password: "abc123",
  //   confirm_password: "abc123",
  //   contact_number: "923331231231",
  // })
  // app.get(ApiService).createApiKey({
  //   description: "Fehm-Public",
  //   access_level: APIAccessLevel.Standard,
  //   name: "Fehm-Public"
  // }, user)
  app.use(
    session({
      secret: configService.get("APP_ID"),
      resave: false,
      saveUninitialized: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Fehm API')
    .setDescription('Fehm API doc ')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'AccessToken')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header',  }, 'ApiKeyAuth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get("PORT") || 3000);
}
bootstrap();
