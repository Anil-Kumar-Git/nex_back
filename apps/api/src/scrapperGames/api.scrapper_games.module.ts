import { Module } from '@nestjs/common';

import { ApiScrapperGamesController } from './api.scrapper_games.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { MulterModule } from '@nestjs/platform-express';
import { ScrapperGamesModule } from '@app/shared/scrapperGames/scrapper_games.module';

@Module({
  imports: [CustomResponseModule,
     ScrapperGamesModule,
    MulterModule.register({
    dest: './uploads',
  })
],
  controllers: [ApiScrapperGamesController],
})
export class ApiScrapperGamesModule {}
