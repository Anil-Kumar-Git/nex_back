import { Module } from '@nestjs/common';

import {ApiProviderProposalController } from './api.providerProposal.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
 import { ProviderProposalModule } from '@app/shared/providerProposal/providerProposal.module';
@Module({
  imports: [CustomResponseModule, ProviderProposalModule],
  controllers: [ApiProviderProposalController],
})
export class ApiProviderProposalModule {}
