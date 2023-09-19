import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {OperatorProposalService } from './operatorProposal.service';

import { CustomResponseModule } from '../core/custom-response/custom-response.module';
import { OperatorProposal } from './operatorProposal.entity';
import { ProviderProposalService } from '../providerProposal/providerProposal.service';
import { ProvidersService } from '../providers/providers.service';
import { GameTrackingService } from '../gameTracking/game_tracking.service';
import { OperatorsService } from '../operators/operators.service';
import { ContractsService } from '../contracts/contracts.service';
import { UsersDeactivateService } from '../users/deactvate.user.service';
import { UsersService } from '../users/users.service';
import { ExternalProviderOpeartorService } from '../externalProviderOperator/externalProviderOperator.service';
import { NotificationService } from '../notification/notification.service';
import { GamesService } from '../games/games.service';
import { SandgridService } from '../sandgrid/sandgrid.service';
import { ProviderOperatorService } from '../provider-operator/provider-operator.service';
import { ProposalTrackingService } from '../proposalTracking/proposal_tracking.service';
import { UserProviderOperatorService } from '../user-provider-operator/user-provider-operator.service';
import { ConfigService } from '../core/config/config.service';
import { UserProviderOperator } from '../user-provider-operator/user-provider-operator.entity';
import { ProposalTracking } from '../proposalTracking/proposal_tracking.entity';
import { ProviderOperator } from '../provider-operator/provider-operator.entity';
import { SandGrid } from '../sandgrid/sandgrid.entity';
import { Games } from '../games/games.entity';
import { externalProviderOpeartors } from '../externalProviderOperator/externalProviderOperator.entity';
import { Users } from '../users/users.entity';
import { ProviderProposal } from '../providerProposal/providerProposal.entity';
import { GameTracking } from '../gameTracking/game_tracking.entity';
import { Providers } from '../providers/providers.entity';
import { Operators } from '../operators/operators.entity';
import { Contracts } from '../contracts/contracts.entity';
import { Notification } from '../notification/notification.entity';
 
@Module({
  imports: [CustomResponseModule, TypeOrmModule.forFeature([ProviderProposal, GameTracking, Providers, Operators,Contracts,Users, OperatorProposal, externalProviderOpeartors, Notification, Games, SandGrid, ProviderOperator,ProposalTracking,UserProviderOperator])],
  providers: [ProviderProposalService, ProvidersService, GameTrackingService, OperatorsService,ContractsService, OperatorProposalService,UsersDeactivateService,UsersService, ExternalProviderOpeartorService, NotificationService, GamesService, SandgridService, ProviderOperatorService,ProposalTrackingService,UserProviderOperatorService, ConfigService],
  exports: [OperatorProposalService],
})
export class OperatorProposalModule {}


