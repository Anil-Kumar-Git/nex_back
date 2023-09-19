import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {ProposalTrackingService } from './proposal_tracking.service';

import { CustomResponseModule } from '../core/custom-response/custom-response.module';
import {ProposalTracking } from './proposal_tracking.entity';
import { Providers } from '../providers/providers.entity';
import { Operators } from '../operators/operators.entity';
import { ProvidersService } from '../providers/providers.service';
import { OperatorsService } from '../operators/operators.service';
import { ProviderProposalService } from '../providerProposal/providerProposal.service';
import { OperatorProposalService } from '../operatorProposal/operatorProposal.service';
import { ProviderProposal } from '../providerProposal/providerProposal.entity';
import { OperatorProposal } from '../operatorProposal/operatorProposal.entity';
import { Contracts } from '../contracts/contracts.entity';
import { ContractsService } from '../contracts/contracts.service';
import { GameTracking } from '../gameTracking/game_tracking.entity';
import { GameTrackingService } from '../gameTracking/game_tracking.service';
import { externalProviderOpeartorDto } from '../externalProviderOperator/externalProviderOperator.dto';
import { externalProviderOpeartors } from '../externalProviderOperator/externalProviderOperator.entity';
import { ExternalProviderOpeartorService } from '../externalProviderOperator/externalProviderOperator.service';
import { SandGrid } from '../sandgrid/sandgrid.entity';
import { ProviderOperator } from '../provider-operator/provider-operator.entity';
import { SandgridService } from '../sandgrid/sandgrid.service';
import { ProviderOperatorService } from '../provider-operator/provider-operator.service';
import { Games } from '../games/games.entity';
import { GamesService } from '../games/games.service';
import { NotificationModule } from '../notification/notification.module';
import { Notification } from '../notification/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '../core/config/config.service';

@Module({
  imports: [CustomResponseModule,NotificationModule,UsersModule, TypeOrmModule.forFeature([ProposalTracking,Providers,Operators,ProviderProposal,OperatorProposal,Contracts,GameTracking,SandGrid,ProviderOperator,externalProviderOpeartors,Games,Notification])],
  providers: [ProposalTrackingService,ProvidersService,OperatorsService,ProviderProposalService,OperatorProposalService,ContractsService,GameTrackingService,SandgridService,ProviderOperatorService,ExternalProviderOpeartorService,GamesService,NotificationService,ConfigService],
  exports: [ProposalTrackingService],
})
export class ProposalTrackingModule {}
