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
  ClassSerializerInterceptor,
  UseInterceptors,
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
  ApiExcludeController,
} from '@nestjs/swagger';
import { Parser } from '@json2csv/plainjs';
import { BasicAuthGuard } from '@app/shared/basicauth/basic.auth.guard';
import { ErrorResponse } from '@app/shared/common/interfaces/errorResponse.interface';

import { ValidateService } from '@app/shared/core/config/validate.service';
import { CustomResponseService } from '@app/shared/core/custom-response/custom-response.service';

import { GamesService } from '@app/shared/games/games.service';
import { GamesDto } from '@app/shared/games/games.dto';

import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';

@Controller('publish')
@ApiTags('publish')
@UseInterceptors(ClassSerializerInterceptor)
export class WebPublishController {
  constructor(
    private gamesService: GamesService,
    private readonly customResponseService: CustomResponseService,
  ) {}

  @Version('1.0')
  @Get('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @ApiOperation({ description: 'get game' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: null,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async getGame(@Param('id') id): Promise<string> {
    // let game: GamesDto = await this.gamesService.getGame(id);
    // let rootObj = Object.assign(new Object(), game);
    // delete rootObj['contract'];

    // let contract = game.contract;
    // if (contract != null) {
    //   this.extractItem(rootObj, contract, 'contract');
    //   this.extractItem(rootObj, contract.provider, 'provider');
    //   this.extractItem(rootObj, contract.operator, 'operator');

    //   delete rootObj['contract_provider'];
    //   delete rootObj['contract_operator'];
    // }

    // const parser = new Parser();
    // return await parser.parse(rootObj);
    return null
  }

  extractItem(root, child, prefix) {
    if (child != null) {
      for (var key in child) {
        root[prefix + '_' + key] = child[key];
      }
    }
  }
}
