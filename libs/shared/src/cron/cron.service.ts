import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProvidersService } from '../providers/providers.service';
import { OperatorsService } from '../operators/operators.service';
@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name)

  constructor(
    private readonly prService:ProvidersService,
    private readonly opService:OperatorsService
  ){}

  
  // @Cron('*/30 * * * * *')
  @Cron('0 30 0 * * *')
  async handleCron() {
    this.prService.planProStatusChange();
    this.opService.planStatusChange();
    this.logger.debug('Called and change PlanStatus ,(run every 30 second)');
  }

}