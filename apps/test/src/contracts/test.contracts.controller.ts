import {
  Controller,
  UseFilters,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Version,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiProduces,
  ApiConsumes,
  ApiOperation,
  ApiExcludeEndpoint,
  ApiProperty,
  ApiParam,
} from '@nestjs/swagger';
import { BasicAuthGuard } from '@app/shared/basicauth/basic.auth.guard';
import { ErrorResponse } from '@app/shared/common/interfaces/errorResponse.interface';

import { ContractsService } from '@app/shared/contracts/contracts.service';
import { ContractsDto } from '@app/shared/contracts/contracts.dto';
import { Contracts } from '@app/shared/contracts/contracts.entity';

import { ValidateService } from '@app/shared/core/config/validate.service';

import { CustomResponseService } from '@app/shared/core/custom-response/custom-response.service';

import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';

@Controller('contracts')
@ApiTags('contracts')
export class TestContractsController {
  constructor(
    private contractsService: ContractsService,
    private readonly customResponseService: CustomResponseService,
  ) {}

  @ApiExcludeEndpoint()
  @Get('/tests/clear')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  async clear(): Promise<string> {
    return await this.contractsService.clear();
  }
}
