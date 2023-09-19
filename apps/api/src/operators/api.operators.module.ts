import { Module } from '@nestjs/common';

import { ApiOperatorsController } from './api.operators.controller';
import { OperatorsModule } from '@app/shared/operators/operators.module';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';

@Module({
  imports: [CustomResponseModule, OperatorsModule],
  controllers: [ApiOperatorsController],
})
export class ApiOperatorsModule {}
