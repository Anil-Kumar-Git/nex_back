import { Module } from '@nestjs/common';

import { WebNotificationController } from './web.notification.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
 import { GameThemesModule } from '@app/shared/gameThemes/gameThemes.module';
import { NotificationModule } from '@app/shared/notification/notification.module';

@Module({
  imports: [CustomResponseModule, NotificationModule],
  controllers: [WebNotificationController],
})
export class WebNotificationModule {}
