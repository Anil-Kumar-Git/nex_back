import { Module } from '@nestjs/common';

import { WebContractsController } from './web.contracts.controller';
import { ContractsModule } from '@app/shared/contracts/contracts.module';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@app/shared/core/config/config.module';
import { UsersModule } from '@app/shared/users/users.module';
@Module({
  imports: [MulterModule.register({
    dest: './uploads',
  }), CustomResponseModule, ContractsModule, ConfigModule, UsersModule],
  controllers: [WebContractsController],
})
export class WebContractsModule { }
