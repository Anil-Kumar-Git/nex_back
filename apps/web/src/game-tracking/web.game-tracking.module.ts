import { Module } from '@nestjs/common';

import { WebGameTrackingController } from './web.game-tracking.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { GameTrackingModule } from '@app/shared/gameTracking/game_tracking.module';
import { UsersModule } from '@app/shared/users/users.module';
import { ConfigModule } from '@app/shared/core/config/config.module';
 
@Module({
  imports: [CustomResponseModule, GameTrackingModule,ConfigModule, UsersModule],
  controllers: [WebGameTrackingController],
})
export class WebGameTrackingModule {}
