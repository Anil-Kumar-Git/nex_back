import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { SharedModule } from '@app/shared';

import { BasicAuthModule } from '@app/shared/basicauth/basic.auth.module';

import { ApiUsersModule } from './users/api.users.module';
import { ApiContractsModule } from './contracts/api.contracts.module';
import { ApiGamesModule } from './games/api.games.module';
import { ApiOperatorsModule } from './operators/api.operators.module';
import { ApiProvidersModule } from './providers/api.providers.module';
import { ApiexternalProviderOpeartorsModule } from './externalProviderOperator/api.externalProviderOperator.module';
import { ApiGameThemeModule } from './gameTheme/api.gameTheme.module';
import { ApiOperatorProposalModule } from './operatorProposal/api.operatorProposal.module';
import { ApiProposalTrackingModule } from './proposal-tracking/api.proposal-tracking.module';
import { ApiProviderOperatorModule } from './provider-operator/api.provider-operator.module';
import { ApiProviderProposalModule } from './providerProposal/api.providerProposal.module';
import { ApiPublishModule } from './publish/api.publish.module';
import { ApiUserProviderOperatorModule } from './user-provider-operator/api.user-provider-operator.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ApiKeyGuard } from './ApiKeyGuard';
import { APP_GUARD } from '@nestjs/core';
import { ApiGameTrackingModule } from './game-tracking/api.game-tracking.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@app/shared/users/users.entity';
import { ApiReconciliationModule } from './reconciliation/api.reconciliation.module';
import { ApiScrapperGamesModule } from './scrapperGames/api.scrapper_games.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    SwaggerModule,
    SharedModule,
    ApiUsersModule,
    ApiContractsModule,
    ApiGamesModule,
    ApiProvidersModule,
    ApiexternalProviderOpeartorsModule,
    ApiGameThemeModule,
    ApiGameTrackingModule,
    ApiOperatorProposalModule,
    ApiOperatorsModule,
    ApiProposalTrackingModule,
    ApiProviderOperatorModule,
    ApiProviderProposalModule,
    ApiReconciliationModule,
    // ApiPublishModule,
    ApiUserProviderOperatorModule,
    BasicAuthModule,
    // ApiScrapperGamesModule
  ],
  controllers: [ApiController],
  providers: [ApiService,
    {
    provide: APP_GUARD,
    useClass: ApiKeyGuard,
  }
],
})
export class ApiModule { }
