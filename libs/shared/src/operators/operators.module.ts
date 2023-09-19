import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OperatorsService } from './operators.service';

import { CustomResponseModule } from './../core/custom-response/custom-response.module';
import { Operators } from './operators.entity';

@Module({
  imports: [CustomResponseModule, TypeOrmModule.forFeature([Operators])],
  providers: [OperatorsService],
  exports: [OperatorsService],
})
export class OperatorsModule {}
