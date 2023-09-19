import { Module } from '@nestjs/common';

import { WebProviderProposalController } from './web.providerProposal.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
 import { ProviderProposalModule } from '@app/shared/providerProposal/providerProposal.module';
@Module({
  imports: [CustomResponseModule, ProviderProposalModule],
  controllers: [WebProviderProposalController],
})
export class WebProviderProposalModule {}
