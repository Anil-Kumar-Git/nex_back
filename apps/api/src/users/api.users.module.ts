import { Module } from '@nestjs/common';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { UsersModule } from '@app/shared/users/users.module';

import { ApiUsersController } from './api.users.controller';

@Module({
  imports: [CustomResponseModule, UsersModule],
  controllers: [ApiUsersController],
})
export class ApiUsersModule {}
