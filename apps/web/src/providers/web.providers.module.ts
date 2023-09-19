import { Module } from '@nestjs/common';

import { WebProvidersController } from './web.providers.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { ProvidersModule } from '@app/shared/providers/providers.module';

@Module({
  imports: [CustomResponseModule, ProvidersModule],
  controllers: [WebProvidersController],
})
export class WebProvidersModule {}
