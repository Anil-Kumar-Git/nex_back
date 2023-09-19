import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersService } from "./users.service";

import { CustomResponseModule } from "./../core/custom-response/custom-response.module";
import { Users } from "./users.entity";

import { OperatorsModule } from "./../operators/operators.module";
import { ProvidersModule } from "./../providers/providers.module";
import { SandgridModule } from "../sandgrid/sandgrid.module";
import { SandgridService } from "../sandgrid/sandgrid.service";
import { UserProviderOperatorModule } from "../user-provider-operator/user-provider-operator.module";
import { UserProviderOperator } from "../user-provider-operator/user-provider-operator.entity";
import { UserProviderOperatorService } from "../user-provider-operator/user-provider-operator.service";
import { UsersDeactivateService } from "./deactvate.user.service";
import { Games } from "../games/games.entity";
import { ProposalTracking } from "../proposalTracking/proposal_tracking.entity";
import { ProviderOperator } from "../provider-operator/provider-operator.entity";
import { ProviderProposal } from "../providerProposal/providerProposal.entity";
import { Providers } from "../providers/providers.entity";
import { GameTracking } from "../gameTracking/game_tracking.entity";
import { Contracts } from "../contracts/contracts.entity";
import { Operators } from "../operators/operators.entity";
import { OperatorProposal } from "../operatorProposal/operatorProposal.entity";
import { Cron, ScheduleModule } from "@nestjs/schedule";
import { externalProviderOpeartors } from "../externalProviderOperator/externalProviderOperator.entity";

@Module({
  imports: [
    CustomResponseModule,
    TypeOrmModule.forFeature([
      OperatorProposal,
      Operators,
      Contracts,
      Users,
      UserProviderOperator,
      Games,
      ProposalTracking,
      ProviderOperator,
      ProviderProposal,
      Providers,
      GameTracking,
      externalProviderOpeartors
    ]),
    ProvidersModule,
    SandgridModule,
    OperatorsModule
  ],
  providers: [
    UsersService,
    SandgridService,
    UserProviderOperatorService,
    UsersDeactivateService,
  ],
  exports: [UsersService, 
    UsersDeactivateService
  ],
})
export class UsersModule {}
