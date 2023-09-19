import { Module } from '@nestjs/common';

import { ApiexternalProviderOpeartorsController } from './api.externalProviderOperator.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { externalProviderOpeartorsModule } from '@app/shared/externalProviderOperator/externalProviderOperator.module';
@Module({
  imports: [CustomResponseModule, externalProviderOpeartorsModule],
  controllers: [ApiexternalProviderOpeartorsController],
})
export class ApiexternalProviderOpeartorsModule { }
