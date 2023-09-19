import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';

import { ApiUsersModule } from './../../api/src/users/api.users.module';
import { ApiContractsModule } from './../../api/src/contracts/api.contracts.module';
import { ApiGamesModule } from './../../api/src/games/api.games.module';
import { ApiOperatorsModule } from './../../api/src/operators/api.operators.module';
import { ApiProvidersModule } from './../../api/src/providers/api.providers.module';

import { WebUsersModule } from './users/web.users.module';
import { WebContractsModule } from './contracts/web.contracts.module';
import { WebGamesModule } from './games/web.games.module';
import { WebOperatorsModule } from './operators/web.operators.module';
import { WebProvidersModule } from './providers/web.providers.module';
import { WebexternalProviderOpeartorsModule } from './externalProviderOperator/web.externalProviderOperator.module';
import { WebPublishModule } from './publish/web.publish.module';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { TerminusModule } from '@nestjs/terminus';

import { WebController } from './web.controller';
import { WebService } from './web.service';
import { WebOperatorProposalModule } from './operatorProposal/web.operatorProposal.module';
import { WebProviderProposalModule } from './providerProposal/web.providerProposal.module';
import { WebProviderOperatorModule } from './provider-operator/web.provider-operator.module';
import { WebProposalTrackingModule } from './proposal-tracking/web.proposal-tracking.module';
import { WebGameThemeModule } from './gameTheme/web.gameTheme.module';
import { WebUserProviderOperatorModule } from './user-provider-operator/web.user-provider-operator.module';
import { WebGameTrackingModule } from './game-tracking/web.game-tracking.module';
import { WebNotificationModule } from './notification/web.notification.module';
import { WebReconciliationModule } from './reconciliation/web.reconciliation.module';
import { WebScrapperGamesModule } from './scrapperGames/web.scrapper_games.module';
import { CronModule } from '@app/shared/cron/cron.module';

@Module({
  imports: [
    SharedModule,
    TerminusModule,
    //ApiUsersModule,
    //ApiContractsModule,
    WebGamesModule,
    ApiGamesModule,
    //ApiOperatorsModule,
    //ApiProvidersModule,
    WebUsersModule,
    WebContractsModule,
    WebOperatorsModule,
    WebProvidersModule,
    WebexternalProviderOpeartorsModule,
    WebOperatorProposalModule,
    WebProviderProposalModule,
    WebProviderOperatorModule,
    WebProposalTrackingModule,
    WebUserProviderOperatorModule,
    WebGameTrackingModule,
    //  WebPublishModule,
    WebScrapperGamesModule,
    WebGameThemeModule,
    WebNotificationModule,
    WebReconciliationModule,
    AuthModule,
    CronModule
  ],
  controllers: [WebController],
  providers: [WebService],
})
export class WebModule { }
