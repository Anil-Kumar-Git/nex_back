import { Module } from '@nestjs/common';

import { ApiPublishController } from './api.publish.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { GamesModule } from '@app/shared/games/games.module';

@Module({
  imports: [CustomResponseModule, GamesModule],
  controllers: [ApiPublishController],
})
export class ApiPublishModule {}
