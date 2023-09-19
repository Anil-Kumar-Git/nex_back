import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExternalProviderOpeartorService } from './externalProviderOperator.service';

import { CustomResponseModule } from '../core/custom-response/custom-response.module';
import { externalProviderOpeartors } from './externalProviderOperator.entity';
import { Operators } from '../operators/operators.entity';
import { OperatorsService } from '../operators/operators.service';
import { Providers } from '../providers/providers.entity';
import { ProvidersService } from '../providers/providers.service';
import { SandgridModule } from '../sandgrid/sandgrid.module';
import { SandgridService } from '../sandgrid/sandgrid.service';
import { ProviderOperatorService } from '../provider-operator/provider-operator.service';
import { ProviderOperator } from '../provider-operator/provider-operator.entity';
import { SandGrid } from '../sandgrid/sandgrid.entity';

@Module({
  imports: [CustomResponseModule,TypeOrmModule.forFeature([Providers,Operators,externalProviderOpeartors,SandGrid,ProviderOperator])],
  providers: [ExternalProviderOpeartorService,ProvidersService,OperatorsService,SandgridService,ProviderOperatorService],
  exports: [ExternalProviderOpeartorService],
})
export class externalProviderOpeartorsModule {}
