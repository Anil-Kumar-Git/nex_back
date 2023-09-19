import { Module } from '@nestjs/common';

import { ApiUserProviderOperatorController } from './api.user-provider-operator.controller';

import { CustomResponseModule } from '@app/shared/core/custom-response/custom-response.module';
import { UserProviderOperatorModule } from '@app/shared/user-provider-operator/user-provider-operator.module';

@Module({
  imports: [CustomResponseModule, UserProviderOperatorModule],
  controllers: [ApiUserProviderOperatorController],
})
export class ApiUserProviderOperatorModule { }
