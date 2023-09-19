import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { SharedService } from './shared.service';

import { DatabaseModule } from './core/database/database.module';
import { CustomResponseModule } from './core/custom-response/custom-response.module';

import { OperatorsModule } from './operators/operators.module';
import { ProvidersModule } from './providers/providers.module';
import { externalProviderOpeartorsModule } from './externalProviderOperator/externalProviderOperator.module';
import { GamesModule } from './games/games.module';
import { UsersModule } from './users/users.module';
import { ContractsModule } from './contracts/contracts.module';
import { OperatorProposalModule } from './operatorProposal/operatorProposal.module';
import { ProviderProposalModule } from './providerProposal/providerProposal.module';
import { ProviderOperatorModule } from './provider-operator/provider-operator.module';
import { ProposalTrackingModule } from './proposalTracking/proposal_tracking.module';
import { SandgridModule } from './sandgrid/sandgrid.module';
import { GameThemesModule } from './gameThemes/gameThemes.module';
import { UserProviderOperatorModule } from './user-provider-operator/user-provider-operator.module';
import { GameTrackingModule } from './gameTracking/game_tracking.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { NotificationModule } from './notification/notification.module';
import { ReconciliationModule } from './reconciliation/reconciliation.module';
 
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomResponseModule,
    DatabaseModule,
    OperatorsModule,
    ContractsModule,
    ProvidersModule,
    externalProviderOpeartorsModule,
    OperatorProposalModule,
    ProviderProposalModule,
    ProviderOperatorModule,
    ProposalTrackingModule,
    GameTrackingModule,
    UserProviderOperatorModule,
    SandgridModule,
    GameThemesModule,
    UsersModule,
    GamesModule,
    NotificationModule,
    ReconciliationModule,
    ScheduleModule.forRoot()

  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule { }
