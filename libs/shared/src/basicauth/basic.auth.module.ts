import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicAuthStrategy } from './basic.auth.strategy';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from '@app/shared/users/users.module';

@Module({
  imports: [PassportModule, ConfigModule, UsersModule],
  providers: [BasicAuthStrategy],
})
export class BasicAuthModule {}
