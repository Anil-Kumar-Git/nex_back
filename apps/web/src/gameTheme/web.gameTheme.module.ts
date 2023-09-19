import { Module } from '@nestjs/common';

import { WebGameThemeController } from './web.gameTheme.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
 import { GameThemesModule } from '@app/shared/gameThemes/gameThemes.module';

@Module({
  imports: [CustomResponseModule, GameThemesModule],
  controllers: [WebGameThemeController],
})
export class WebGameThemeModule {}
