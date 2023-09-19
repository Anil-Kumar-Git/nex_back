import { Module } from '@nestjs/common';

import { WebOperatorProposalController } from './web.operatorProposal.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
 import { OperatorProposalModule } from '@app/shared/operatorProposal/operatorProposal.module';
@Module({
  imports: [CustomResponseModule, OperatorProposalModule],
  controllers: [WebOperatorProposalController],
})
export class WebOperatorProposalModule {}
