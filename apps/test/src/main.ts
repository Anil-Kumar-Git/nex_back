import { NestFactory } from '@nestjs/core';
import { TestModule } from './test.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { BasicAuthGuard } from '@app/shared/basicauth/basic.auth.guard';
import { GlobalService } from '@app/shared/core/config/global.service';
import { UsersService } from '@app/shared/users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(TestModule);
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
  SwaggerModule.setup('api', app, document);

  app.useGlobalGuards(new BasicAuthGuard());

  const usersService = app.get(UsersService);
  GlobalService.usersService = usersService;

  await app.listen(3001);
}
bootstrap();
