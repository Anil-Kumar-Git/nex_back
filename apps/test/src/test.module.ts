import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';

import { ApiUsersModule } from './../../api/src/users/api.users.module';
import { ApiContractsModule } from './../../api/src/contracts/api.contracts.module';
import { ApiGamesModule } from './../../api/src/games/api.games.module';
import { ApiOperatorsModule } from './../../api/src/operators/api.operators.module';
import { ApiProvidersModule } from './../../api/src/providers/api.providers.module';

import { TestsModule } from './tests/tests.module';
import { BasicAuthModule } from '@app/shared/basicauth/basic.auth.module';
import { TestUsersModule } from './users/test.users.module';
import { TestContractsModule } from './contracts/test.contracts.module';
import { TestGamesModule } from './games/test.games.module';
import { TestOperatorsModule } from './operators/test.operators.module';
import { TestProvidersModule } from './providers/test.providers.module';

@Module({
  imports: [
    SharedModule,
    ApiUsersModule,
    ApiContractsModule,
    ApiGamesModule,
    ApiOperatorsModule,
    ApiProvidersModule,
    TestsModule,
    TestUsersModule,
    TestContractsModule,
    TestGamesModule,
    TestOperatorsModule,
    TestProvidersModule,
    BasicAuthModule,
  ],
})
export class TestModule {}
