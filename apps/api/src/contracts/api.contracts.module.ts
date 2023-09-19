import { Module } from '@nestjs/common';

import { ApiContractsController } from './api.contracts.controller';
import { ContractsModule } from '@app/shared/contracts/contracts.module';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [ MulterModule.register({
    dest: './uploads',
  }),CustomResponseModule, ContractsModule],
  controllers: [ApiContractsController],
})
export class ApiContractsModule {}
