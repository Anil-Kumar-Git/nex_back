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
} from "@nestjs/common";
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
  ApiHeader,
  ApiSecurity,
} from "@nestjs/swagger";
import { Parser } from "@json2csv/plainjs";
import { BasicAuthGuard } from "@app/shared/basicauth/basic.auth.guard";
import { ErrorResponse } from "@app/shared/common/interfaces/errorResponse.interface";

import { ValidateService } from "@app/shared/core/config/validate.service";
import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { GamesService } from "@app/shared/games/games.service";
import { GamesDto } from "@app/shared/games/games.dto";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";

@Controller("publish")
@ApiTags("Publish Apis")
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiPublishController {
  constructor(
    private gamesService: GamesService,
    private readonly customResponseService: CustomResponseService
  ) {}

  @Version("1.0")
  @Get("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Kindly input your publish ID here to retrieve comprehensive publish information. Upon successful publish creation, you'll receive your publish ID. Alternatively, you can utilize the 'get' APIs for publish to obtain your publish ID." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "ok"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async getGame(@Param("id") id): Promise<string> {
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
    return null;
  }

  extractItem(root, child, prefix) {
    if (child != null) {
      for (var key in child) {
        root[prefix + "_" + key] = child[key];
      }
    }
  }
}
