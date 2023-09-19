import { Module } from '@nestjs/common';

import { TestProvidersController } from './test.providers.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { ProvidersModule } from '@app/shared/providers/providers.module';

@Module({
  imports: [CustomResponseModule, ProvidersModule],
  controllers: [TestProvidersController],
})
export class TestProvidersModule {}
