import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameTrackingService } from './game_tracking.service';

import { CustomResponseModule } from '../core/custom-response/custom-response.module';
import { GameTracking } from './game_tracking.entity';
import { Providers } from '../providers/providers.entity';
import { Operators } from '../operators/operators.entity';
import { ProvidersService } from '../providers/providers.service';
import { OperatorsService } from '../operators/operators.service';
import { ProviderProposalService } from '../providerProposal/providerProposal.service';
import { OperatorProposalService } from '../operatorProposal/operatorProposal.service';
import { ProviderProposal } from '../providerProposal/providerProposal.entity';
import { OperatorProposal } from '../operatorProposal/operatorProposal.entity';
import { ExternalProviderOpeartorService } from '../externalProviderOperator/externalProviderOperator.service';
import { externalProviderOpeartors } from '../externalProviderOperator/externalProviderOperator.entity';
import { SandGrid } from '../sandgrid/sandgrid.entity';
import { SandgridService } from '../sandgrid/sandgrid.service';
import { ProviderOperator } from '../provider-operator/provider-operator.entity';
import { ProviderOperatorService } from '../provider-operator/provider-operator.service';
import { Games } from '../games/games.entity';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/notification.entity';
import { ConfigModule } from '../core/config/config.module';
import { ConfigService } from '../core/config/config.service';
import { ProposalTracking } from '../proposalTracking/proposal_tracking.entity';
import { ProposalTrackingService } from '../proposalTracking/proposal_tracking.service';
import { Contracts } from '../contracts/contracts.entity';
import { ContractsService } from '../contracts/contracts.service';
import { GamesService } from '../games/games.service';
import { UsersDeactivateService } from '../users/deactvate.user.service';
import { UsersService } from '../users/users.service';
import { Users } from '../users/users.entity';
import { UserProviderOperator } from '../user-provider-operator/user-provider-operator.entity';
import { UserProviderOperatorService } from '../user-provider-operator/user-provider-operator.service';

@Module({
  imports: [CustomResponseModule,ConfigModule, TypeOrmModule.forFeature([GameTracking, Providers, Operators, ProviderProposal, OperatorProposal,SandGrid,ProviderOperator, externalProviderOpeartors,Games,Notification,ProposalTracking,Users,Contracts,UserProviderOperator])],
  providers: [GameTrackingService, ProvidersService, OperatorsService, ProviderProposalService, OperatorProposalService,SandgridService,ProviderOperatorService, ExternalProviderOpeartorService,NotificationService,ProposalTrackingService,ContractsService,GamesService,UsersDeactivateService,UsersService,UserProviderOperatorService,ConfigService],
  exports: [GameTrackingService],
})
export class GameTrackingModule { }
