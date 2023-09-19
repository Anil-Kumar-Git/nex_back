import { Module } from '@nestjs/common';

import { ApiGameTrackingController } from './api.game-tracking.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { GameTrackingModule } from '@app/shared/gameTracking/game_tracking.module';
 
@Module({
  imports: [CustomResponseModule, GameTrackingModule],
  controllers: [ApiGameTrackingController],
})
export class ApiGameTrackingModule {}
