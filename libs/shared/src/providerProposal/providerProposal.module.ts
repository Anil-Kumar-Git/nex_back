import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProviderProposalService } from './providerProposal.service';

import { CustomResponseModule } from '../core/custom-response/custom-response.module';
import { ProviderProposal } from './providerProposal.entity';
import { GameTrackingModule } from '../gameTracking/game_tracking.module';
import { GameTrackingService } from '../gameTracking/game_tracking.service';
import { GameTracking } from '../gameTracking/game_tracking.entity';
import { ProvidersModule } from '../providers/providers.module';
import { ProvidersService } from '../providers/providers.service';
import { Providers } from '../providers/providers.entity';
import { OperatorsService } from '../operators/operators.service';
import { Operators } from '../operators/operators.entity';
import { OperatorProposal } from '../operatorProposal/operatorProposal.entity';
import { OperatorProposalService } from '../operatorProposal/operatorProposal.service';
import { ExternalProviderOpeartorService } from '../externalProviderOperator/externalProviderOperator.service';
import { externalProviderOpeartors } from '../externalProviderOperator/externalProviderOperator.entity';
import { Notification } from '../notification/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { ConfigService } from '../core/config/config.service';
import { Games } from '../games/games.entity';
import { GamesService } from '../games/games.service';
import { SandGrid } from '../sandgrid/sandgrid.entity';
import { SandgridService } from '../sandgrid/sandgrid.service';
import { ProviderOperator } from '../provider-operator/provider-operator.entity';
import { ProviderOperatorService } from '../provider-operator/provider-operator.service';
import { ProposalTracking } from '../proposalTracking/proposal_tracking.entity';
import { ProposalTrackingService } from '../proposalTracking/proposal_tracking.service';
import { Contracts } from '../contracts/contracts.entity';
import { ContractsService } from '../contracts/contracts.service';
import { Users } from '../users/users.entity';
import { UsersDeactivateService } from '../users/deactvate.user.service';
import { UserProviderOperator } from '../user-provider-operator/user-provider-operator.entity';
import { UserProviderOperatorDto } from '../user-provider-operator/user-provider-operator.dto';
import { UserProviderOperatorService } from '../user-provider-operator/user-provider-operator.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [CustomResponseModule, TypeOrmModule.forFeature([ProviderProposal, GameTracking, Providers, Operators,Contracts,Users, OperatorProposal, externalProviderOpeartors, Notification, Games, SandGrid, ProviderOperator,ProposalTracking,UserProviderOperator])],
  providers: [ProviderProposalService, ProvidersService, GameTrackingService, OperatorsService,ContractsService, OperatorProposalService,UsersDeactivateService,UsersService, ExternalProviderOpeartorService, NotificationService, GamesService, SandgridService, ProviderOperatorService,ProposalTrackingService,UserProviderOperatorService, ConfigService],
  exports: [ProviderProposalService],
})
export class ProviderProposalModule { }
