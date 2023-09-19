import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { ProvidersService } from '../providers/providers.service';
import { OperatorsService } from '../operators/operators.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Providers } from '../providers/providers.entity';
import { Operators } from '../operators/operators.entity';

@Module({
    imports: [ScheduleModule,
      TypeOrmModule.forFeature([Providers,Operators]),],
    providers: [CronService,ProvidersService,OperatorsService],
  })
export class CronModule {}
