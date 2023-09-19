import { NestFactory, Reflector } from '@nestjs/core';
import { WebModule } from './web.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cors from 'cors';

import { JWTAuthGuard } from './auth/jwt.auth.guard';
import { SessionAuthGuard } from './auth/session.auth.guard';

import { ConfigService } from '@app/shared/core/config/config.service';
import { ConfigModule } from '@app/shared/core/config/config.module';

import { GlobalService } from '@app/shared/core/config/global.service';
import { UsersService } from '@app/shared/users/users.service';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(WebModule);

  let configService = new ConfigService();
 
  const WEB_PORT = configService.get('WEB_PORT')
  app.use(cookieParser(configService.get('secretKey')));
  app.use(json({ limit: '200mb' }));

  app.use(
    session({
      secret: configService.get('secretKey'),
      resave: false,
      saveUninitialized: false,
      store: new session.MemoryStore(),
      cookie: {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV.trim() === 'production',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(/\s*,\s*/) ?? '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  // app.enableCors({
  //   origin: ['*',process.env.ALLOW_ORIGIN1,process.env.ALLOW_ORIGIN2],
  //   credentials: true,
  //   exposedHeaders: ['Authorization'],
  // });

  useContainer(app.select(WebModule), { fallbackOnErrors: true });

  app.enableVersioning({
    defaultVersion: '1.0',
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Nexus7995 API')
    .setDescription('Nexus7995 API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1.0/swagger', app, document);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JWTAuthGuard(reflector),
    new SessionAuthGuard(reflector),
  );

  const usersService = app.get(UsersService);
  GlobalService.usersService = usersService;

  await app.listen(WEB_PORT, () => {
    console.log(`WEB Server started on http://localhost:${WEB_PORT}`);
  })
}
bootstrap();
