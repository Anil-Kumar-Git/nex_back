import { Module } from '@nestjs/common';

import { TestContractsController } from './test.contracts.controller';
import { ContractsModule } from '@app/shared/contracts/contracts.module';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';

@Module({
  imports: [CustomResponseModule, ContractsModule],
  controllers: [TestContractsController],
})
export class TestContractsModule {}
