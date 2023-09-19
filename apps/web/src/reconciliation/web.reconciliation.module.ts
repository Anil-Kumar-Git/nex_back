import { Module } from '@nestjs/common';

import { WebReconciliationController } from './web.reconciliation.controller';
import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { ReconciliationModule } from '@app/shared/reconciliation/reconciliation.module';

@Module({
  imports: [CustomResponseModule, ReconciliationModule],
  controllers: [WebReconciliationController],
})
export class WebReconciliationModule { }
