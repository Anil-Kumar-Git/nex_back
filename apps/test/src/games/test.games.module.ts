import { Module } from '@nestjs/common';

import { TestGamesController } from './test.games.controller';
import { GamesModule } from '@app/shared/games/games.module';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';

@Module({
  imports: [CustomResponseModule, GamesModule],
  controllers: [TestGamesController],
})
export class TestGamesModule {}
