import { Module } from '@nestjs/common';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { UsersModule } from '@app/shared/users/users.module';

import { WebUsersController } from './web.users.controller';

@Module({
  imports: [CustomResponseModule, UsersModule],
  controllers: [WebUsersController],
})
export class WebUsersModule {}
