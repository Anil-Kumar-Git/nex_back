import { Module } from '@nestjs/common';

import { ApiProviderOperatorController } from './api.provider-operator.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { ProviderOperatorModule } from '@app/shared/provider-operator/provider-operator.module';
 
@Module({
  imports: [CustomResponseModule, ProviderOperatorModule],
  controllers: [ApiProviderOperatorController],
})
export class ApiProviderOperatorModule {}
