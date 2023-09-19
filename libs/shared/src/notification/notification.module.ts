import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from './notification.service';

import { CustomResponseModule } from '../core/custom-response/custom-response.module';
import { Notification } from './notification.entity';
import { SandgridModule } from '../sandgrid/sandgrid.module';
import { SandGrid } from '../sandgrid/sandgrid.entity';
import { SandgridService } from '../sandgrid/sandgrid.service';
    
@Module({
  imports: [CustomResponseModule,TypeOrmModule.forFeature([Notification,SandGrid])],
  providers: [NotificationService,SandgridService],
  exports: [NotificationService],
})
export class NotificationModule {}
