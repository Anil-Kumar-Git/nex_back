import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {UserProviderOperatorService } from './user-provider-operator.service';

import { CustomResponseModule } from '../core/custom-response/custom-response.module';
import { UserProviderOperator } from './user-provider-operator.entity';
import { SandgridService } from '../sandgrid/sandgrid.service';
import { SandgridModule } from '../sandgrid/sandgrid.module';

@Module({
  imports: [CustomResponseModule, TypeOrmModule.forFeature([UserProviderOperator]),SandgridModule],
  providers: [UserProviderOperatorService,SandgridService],
  exports: [UserProviderOperatorService],
})
export class UserProviderOperatorModule {}
