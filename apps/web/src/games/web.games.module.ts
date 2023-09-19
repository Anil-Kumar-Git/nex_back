import { Module } from '@nestjs/common';

import { WebGamesController } from './web.games.controller';
import { GamesModule } from '@app/shared/games/games.module';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [CustomResponseModule, GamesModule,
    MulterModule.register({
    dest: './uploads',
  })
],
  controllers: [WebGamesController],
})
export class WebGamesModule {}
