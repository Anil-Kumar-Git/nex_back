import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {ProviderOperatorService } from './provider-operator.service';

import { CustomResponseModule } from '../core/custom-response/custom-response.module';
import { ProviderOperator } from './provider-operator.entity';
 import { ProvidersService } from '../providers/providers.service';
import { Providers } from '../providers/providers.entity';
import { Operators } from '../operators/operators.entity';
 import { OperatorsService } from '../operators/operators.service';
import { externalProviderOpeartors } from '../externalProviderOperator/externalProviderOperator.entity';
import { ExternalProviderOpeartorService } from '../externalProviderOperator/externalProviderOperator.service';
import { SandgridModule } from '../sandgrid/sandgrid.module';
import { SandgridService } from '../sandgrid/sandgrid.service';
  
@Module({
  imports: [CustomResponseModule,TypeOrmModule.forFeature([externalProviderOpeartors,ProviderOperator,Providers,Operators,SandgridModule])],
  providers: [ProviderOperatorService,ExternalProviderOpeartorService,ProvidersService,OperatorsService,SandgridService],
  exports: [ProviderOperatorService],
})
export class ProviderOperatorModule {}
