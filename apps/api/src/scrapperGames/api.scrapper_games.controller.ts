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
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
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
  ApiQuery,
} from "@nestjs/swagger";
import { ErrorResponse, Role } from "@app/shared/common/interfaces/errorResponse.interface";

import { ScrapperGamesService } from "@app/shared/scrapperGames/scrapper_games.service";

import { CustomResponseService } from "@app/shared//core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared//common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";

import { ScrapperGamesDto } from "@app/shared/scrapperGames/scrapper_games.dto";

@Controller("scrappergames")
@ApiTags("Scrapper-Games")
export class ApiScrapperGamesController {
  private readonly type:string; 
  constructor(
    private gamesService: ScrapperGamesService,
    private readonly customResponseService: CustomResponseService
  ) {
    this.type="api"
  }

  @Version("1.0")
  @Get("/search")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "To search for any scrapper-games, you'll need to send typeId, type, and query in the API request. typeId refers to the ID of that operator/provider (operatorId/providerId). type means their userRole, which can be Provider or Operator. query means whatever you want to search for. In the query, you can search data by name, ID, type, or email. In getUserDetails, the company ID will be your operatorId/providerId, and the type will be your userRole." })
  @ApiQuery({
    name: "query",
    description: "query (id ,contractName ,revShareTiedToGameType) parameter",
    type: String,
  })
  @ApiQuery({
    name: "providerName",
    description: "typeId (providerId Or operatorId) query parameter",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: ScrapperGamesDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async findSearch(
    @Query() params: { query?: string; providerName?: string }
  ): Promise<ScrapperGamesDto[]> {
    return await this.gamesService.searchDetails(params);
  }

  @Version("1.0")
  @Get("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Kindly input your scrapper-game ID here to retrieve comprehensive scrapper-game information. Upon successful scrapper-game creation, you'll receive your scrapper-game ID. Alternatively, you can utilize the 'get' APIs for scrapper-game to obtain your scrapper-game ID." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: ScrapperGamesDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async getGame(@Param("id") id): Promise<ScrapperGamesDto> {
    return await this.gamesService.getGameById(id,this.type);
  }

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "To retrieve the list of scrapper-games for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator)." })
  @ApiQuery({
    name: "provider",
    description: "query (id ,contractName ,revShareTiedToGameType) parameter",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: ScrapperGamesDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async findAll(
    @Query() query: { createdBy: string; provider: string; shortBy: string }
  ): Promise<ScrapperGamesDto[]> {
    return await this.gamesService.findAll(query,this.type);
  }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide your scrapper-game ID here to delete the corresponding scrapper-game. If you've successfully created a scrapper-game, you'll have received a scrapper-game ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your scrapper-game ID. Once the scrapper-game is deleted, their information will be removed from the system." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: null,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ErrorResponse,
  })
  async deleteGame(@Param("id") id): Promise<{status:number,message?:string,error?:string}> {
    return await this.gamesService.delete(id,this.type);
  }
}
