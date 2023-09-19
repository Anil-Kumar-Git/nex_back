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
import { TestContractsController } from './../contracts/test.contracts.controller';

import { ErrorResponse } from '@app/shared/common/interfaces/errorResponse.interface';

import { GamesService } from '@app/shared/games/games.service';
import { GamesDto } from '@app/shared/games/games.dto';
import { Games } from '@app/shared/games/games.entity';

import { ValidateService } from '@app/shared//core/config/validate.service';

import { CustomResponseService } from '@app/shared//core/custom-response/custom-response.service';

import { ValidationExceptionFilter } from '@app/shared//common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';

@Controller('games')
@ApiTags('games')
export class TestGamesController {
  constructor(
    private gamesService: GamesService,
    private readonly customResponseService: CustomResponseService,
  ) {}

  @ApiExcludeEndpoint()
  @Get('/tests/clear')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  async clear(): Promise<string> {
    return await this.gamesService.clear();
  }
}
