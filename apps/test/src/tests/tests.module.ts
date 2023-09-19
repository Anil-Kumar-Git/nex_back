import { Module } from '@nestjs/common';

import { TestsController } from './tests.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';

import { UsersModule } from '@app/shared/users/users.module';
import { ContractsModule } from '@app/shared/contracts/contracts.module';
import { OperatorsModule } from '@app/shared/operators/operators.module';
import { ProvidersModule } from '@app/shared/providers/providers.module';
import { GamesModule } from '@app/shared/games/games.module';

@Module({
  imports: [
    CustomResponseModule,
    UsersModule,
    ContractsModule,
    OperatorsModule,
    ProvidersModule,
    GamesModule,
  ],
  controllers: [TestsController],
})
export class TestsModule {}
