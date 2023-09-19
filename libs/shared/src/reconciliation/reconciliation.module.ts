import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { CustomResponseModule } from '../core/custom-response/custom-response.module';
import { ReconciliationService } from './reconciliation.service';
import { Notification } from '../notification/notification.entity';
import { ProvidersService } from '../providers/providers.service';
import { OperatorsService } from '../operators/operators.service';
import { ExternalProviderOpeartorService } from '../externalProviderOperator/externalProviderOperator.service';
import { NotificationService } from '../notification/notification.service';
import { Reconciliation } from './reconciliation.entity';
import { SandgridService } from '../sandgrid/sandgrid.service';
import { Providers } from '../providers/providers.entity';
import { Operators } from '../operators/operators.entity';
import { externalProviderOpeartors } from '../externalProviderOperator/externalProviderOperator.entity';
import { ProviderOperator } from '../provider-operator/provider-operator.entity';

@Module({
    imports: [CustomResponseModule, TypeOrmModule.forFeature([Reconciliation,Notification,Providers,Operators,ProviderOperator,externalProviderOpeartors])],
    providers: [ReconciliationService,NotificationService,ProvidersService,OperatorsService,ExternalProviderOpeartorService,SandgridService],
    exports: [ReconciliationService],
})
export class ReconciliationModule { }
