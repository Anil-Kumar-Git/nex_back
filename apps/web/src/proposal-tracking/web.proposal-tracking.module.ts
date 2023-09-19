import { Module } from '@nestjs/common';

import { WebProposalTrackingController } from './web.proposal-tracking.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { ProposalTrackingModule } from '@app/shared/proposalTracking/proposal_tracking.module';
 
@Module({
  imports: [CustomResponseModule, ProposalTrackingModule],
  controllers: [WebProposalTrackingController],
})
export class WebProposalTrackingModule {}
