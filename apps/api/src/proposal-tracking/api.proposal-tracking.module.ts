import { Module } from '@nestjs/common';

import {ApiProposalTrackingController } from './api.proposal-tracking.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { ProposalTrackingModule } from '@app/shared/proposalTracking/proposal_tracking.module';
 
@Module({
  imports: [CustomResponseModule, ProposalTrackingModule],
  controllers: [ApiProposalTrackingController],
})
export class ApiProposalTrackingModule {}
