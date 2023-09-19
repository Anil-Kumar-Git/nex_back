import { Module } from '@nestjs/common';

import { ApiGamesController } from './api.games.controller';
import { GamesModule } from '@app/shared/games/games.module';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';

@Module({
  imports: [CustomResponseModule, GamesModule],
  controllers: [ApiGamesController],
})
export class ApiGamesModule {}
