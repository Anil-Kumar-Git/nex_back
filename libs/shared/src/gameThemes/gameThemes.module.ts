import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameThemesService } from './gameThemes.service';

import { CustomResponseModule } from '../core/custom-response/custom-response.module';
import { GameThemes } from './gameThemes.entity';
    
@Module({
  imports: [CustomResponseModule,TypeOrmModule.forFeature([GameThemes])],
  providers: [GameThemesService],
  exports: [GameThemesService],
})
export class GameThemesModule {}
