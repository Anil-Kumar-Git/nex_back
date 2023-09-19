import { Module } from '@nestjs/common';
import { SandgridService } from './sandgrid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SandGrid } from './sandgrid.entity';
import { CustomResponseModule } from '../core/custom-response/custom-response.module';

@Module({
  imports: [CustomResponseModule,TypeOrmModule.forFeature([SandGrid])],
  providers: [SandgridService],
  exports: [SandgridService],
})
export class SandgridModule {}