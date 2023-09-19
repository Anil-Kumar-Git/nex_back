import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { BasicAuthGuard } from '@app/shared/basicauth/basic.auth.guard';
import { GlobalService } from '@app/shared/core/config/global.service';
import { UsersService } from '@app/shared/users/users.service';
import { ConfigService } from '@app/shared/core/config/config.service';
import { json } from 'express';
import { handleCss } from '@app/shared/coustomCss/swaggerCss';

 
async function bootstrap() {
     const app = await NestFactory.create(ApiModule);
     app.use(json({ limit: '200mb' }));
 
  // app.enableVersioning({
  //   defaultVersion: '1.0',
  //   type: VersioningType.URI,
  // });
 
  app.setGlobalPrefix("api_api");

  const config = new DocumentBuilder()
    .setTitle("Nexus7995 API")
    .setDescription("Nexus7995 API")
    .setVersion("1.0")
    .addServer("")
    .addApiKey({ type: "apiKey", name: "Api-Key", in: "header" }, "Api-Key")
    .addSecurity('basic',{ type: 'apiKey', in: 'header', name: 'User-Id' ,description:"enter your user ID for authentication" })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1.0/swagger', app, document , {
    customCss: handleCss()
  }
  );

  //app.useGlobalGuards(new BasicAuthGuard());

  const usersService = app.get(UsersService);
  let configService = new ConfigService();

   const API_PORT=configService.get("API_PORT")
  GlobalService.usersService = usersService;

   await app.listen(API_PORT, () => {
    console.log(`API Server started on http://localhost:${API_PORT}`);
  });}
bootstrap();
