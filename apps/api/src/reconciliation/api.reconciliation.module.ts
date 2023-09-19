import { Module } from '@nestjs/common';

import { ApiReconciliationController } from './api.reconciliation.controller';
import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { ReconciliationModule } from '@app/shared/reconciliation/reconciliation.module';

@Module({
  imports: [CustomResponseModule, ReconciliationModule],
  controllers: [ApiReconciliationController],
})
export class ApiReconciliationModule { }
