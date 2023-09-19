import { Module } from '@nestjs/common';

import { WebexternalProviderOpeartorsController } from './web.externalProviderOperator.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { externalProviderOpeartorsModule } from '@app/shared/externalProviderOperator/externalProviderOperator.module';
@Module({
  imports: [CustomResponseModule, externalProviderOpeartorsModule],
  controllers: [WebexternalProviderOpeartorsController],
})
export class WebexternalProviderOpeartorsModule { }
