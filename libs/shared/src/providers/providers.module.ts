import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProvidersService } from './providers.service';

import { CustomResponseModule } from './../core/custom-response/custom-response.module';
import { Providers } from './providers.entity';

@Module({
  imports: [CustomResponseModule, TypeOrmModule.forFeature([Providers])],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
