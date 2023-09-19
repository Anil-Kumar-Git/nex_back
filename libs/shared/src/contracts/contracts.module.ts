import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContractsService } from './contracts.service';

import { CustomResponseModule } from './../core/custom-response/custom-response.module';
import { Contracts } from './contracts.entity';
import { ProviderOperatorService } from '../provider-operator/provider-operator.service';
import { ProviderOperator } from '../provider-operator/provider-operator.entity';
import { SandgridService } from '../sandgrid/sandgrid.service';
import { SandGrid } from '../sandgrid/sandgrid.entity';
import { Providers } from '../providers/providers.entity';
import { ProvidersService } from '../providers/providers.service';
import { OperatorsService } from '../operators/operators.service';
import { Operators } from '../operators/operators.entity';
import { ExternalProviderOpeartorService } from '../externalProviderOperator/externalProviderOperator.service';
import { externalProviderOpeartors } from '../externalProviderOperator/externalProviderOperator.entity';
import { Notification } from '../notification/notification.entity';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [CustomResponseModule, TypeOrmModule.forFeature([Contracts,ProviderOperator,Providers,Operators,externalProviderOpeartors,Notification])],
  providers: [ContractsService,ProviderOperatorService,ProvidersService,OperatorsService,ExternalProviderOpeartorService,SandgridService,NotificationService],
  exports: [ContractsService],
})
export class ContractsModule {}
