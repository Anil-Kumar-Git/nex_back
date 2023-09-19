import { Module } from '@nestjs/common';

import { ApiOperatorProposalController } from './api.operatorProposal.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
 import { OperatorProposalModule } from '@app/shared/operatorProposal/operatorProposal.module';
@Module({
  imports: [CustomResponseModule, OperatorProposalModule],
  controllers: [ApiOperatorProposalController],
})
export class ApiOperatorProposalModule {}
