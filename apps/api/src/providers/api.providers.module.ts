import { Module } from '@nestjs/common';

import { ApiProvidersController } from './api.providers.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { ProvidersModule } from '@app/shared/providers/providers.module';

@Module({
  imports: [CustomResponseModule, ProvidersModule],
  controllers: [ApiProvidersController],
})
export class ApiProvidersModule {}
