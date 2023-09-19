import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScrapperGamesService } from './scrapper_games.service';

import { CustomResponseModule } from '../core/custom-response/custom-response.module';
import { ScrapperGames } from './scrapper_games.entity';
import { GameTrackingService } from '../gameTracking/game_tracking.service';
import { GameTracking } from '../gameTracking/game_tracking.entity';
import { ProposalTracking } from '../proposalTracking/proposal_tracking.entity';
import { ProposalTrackingService } from '../proposalTracking/proposal_tracking.service';
import { GameTrackingModule } from '../gameTracking/game_tracking.module';
import { NotificationModule } from '../notification/notification.module';
import { Notification } from '../notification/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { SandgridModule } from '../sandgrid/sandgrid.module';

@Module({
  imports: [CustomResponseModule,GameTrackingModule,SandgridModule,NotificationModule, TypeOrmModule.forFeature([ScrapperGames])],
  providers: [ScrapperGamesService],
  exports: [ScrapperGamesService],
})
export class ScrapperGamesModule {}
