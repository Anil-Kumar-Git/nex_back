import { Module } from '@nestjs/common';

import { WebProviderOperatorController } from './web.provider-operator.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { ProviderOperatorModule } from '@app/shared/provider-operator/provider-operator.module';
 
@Module({
  imports: [CustomResponseModule, ProviderOperatorModule],
  controllers: [WebProviderOperatorController],
})
export class WebProviderOperatorModule {}
