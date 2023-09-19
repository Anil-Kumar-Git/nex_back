import { Module } from '@nestjs/common';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { UsersModule } from '@app/shared/users/users.module';

import { TestUsersController } from './test.users.controller';

@Module({
  imports: [CustomResponseModule, UsersModule],
  controllers: [TestUsersController],
})
export class TestUsersModule {}
