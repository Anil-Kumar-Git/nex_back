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
  HttpCode,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  HttpException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiSecurity,
} from "@nestjs/swagger";
import {
  ErrorResponse,
  Role,
} from "@app/shared/common/interfaces/errorResponse.interface";

import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { query } from "express";
import { GameTrackingDto } from "@app/shared/gameTracking/game_tracking.dto";
import { GameTrackingService } from "@app/shared/gameTracking/game_tracking.service";
import { handleError } from "@app/shared/common/errorHandling";
import { ApiGameTrackingUpdateDto } from "@app/shared/common/apiDtos";

@Controller("gameTracking")
@ApiTags("Game Tracking")
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiGameTrackingController {
  private readonly type:string; 
  constructor(
    private GameTrackingService: GameTrackingService,
    private readonly customResponseService: CustomResponseService
  ) {this.type="api"}

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To retrieve the list of game-tracking for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator)." })
  // @ApiQuery({
  //   name: "id",
  //   description: "id of Proposal-tracking Parameter",
  //   type: String,
  //   required: false,
  // })
  // @ApiQuery({
  //   name: "createdBy",
  //   description: "createdBy id (who created this game)",
  //   type: String,
  //   required: false,
  // })
  @ApiQuery({
    name: "typeId",
    description: "operator id or provider id (who created this game)",
    type: String,
    required: true,
  })
  @ApiQuery({
    name: "proposalId",
    description: "proposal id (who created this game)",
    type: String,
    required: false,
  })
  // @ApiQuery({
  //   name: "gameId",
  //   description: "game id (who created this game)",
  //   type: String,
  //   required: false,
  // })
  @ApiQuery({
    name: "index",
    enum: Role,
    enumName: "typeOptions",
    description: "Choose any one",
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",

    isArray: false,
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
  async findAll(
    @Query()
    params: {
      id: string;
      index: string;
      providerId: string;
      operatorId: string;
      typeId: string;
      proposalId: string;
      contractId: string;
      gameId: string;
      createdBy: string;
    }
  ): Promise<{ status: string; data?: GameTrackingDto[]; error?: string; length?:number }> 
  {
    params.index == "Provider"
      ? (params.providerId == params.typeId)
      : (params.operatorId = params.typeId);
  return await this.GameTrackingService.getGameTrackingByDetails(params,this.type);

    
  }

  @Version("1.0")
  @Get("/search/data")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To search for any games, you'll need to send typeId, type, and query in the API request. typeId refers to the ID of that operator/provider (operatorId/providerId). type means their userRole, which can be Provider or Operator. query means whatever you want to search for. In the query, you can search data by name, ID, type, or email. In getUserDetails, the company ID will be your operatorId/providerId, and the type will be your userRole." })
  @ApiQuery({
    name: "typeId",
    description: "ProviderId or OperatorId type id",
    type: String,
  })
  @ApiQuery({
    name: "query",
    description: "query Parameter like gameId or gameName",
    type: String,
    required: true,
  })
  @ApiQuery({
    name: "type",
    enum: Role,
    enumName: "typeOptions",
    description: "Choose any one",
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",

    isArray: false,
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
  async findSearch(
    @Query() params: { query?: string; typeId?: string; type: string }
  ): Promise<GameTrackingDto[]> {
    return await this.GameTrackingService.searchDetails(params,this.type);
  }

  @Version("1.0")
  @Get("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "Kindly input your game-tracking ID here to retrieve comprehensive game-tracking information. Upon successful game-tracking creation, you'll receive your game-tracking ID. Alternatively, you can utilize the 'get' APIs for game-tracking to obtain your game-tracking ID." })
  @ApiParam({ name: "id", type: String, required: true })
  // @ApiQuery({
  //   name: "typeId",
  //   description: "ProviderId or OperatorId type id",
  //   type: String,
  // })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",

    isArray: false,
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
  async findById(@Param("id") id: string): Promise<GameTrackingDto> {
  return await this.GameTrackingService.getGameTrackingById(id,this.type);   
  }

  // @Version("1.0")
  // @Post("/")
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @ApiOperation({ description: "create operator or provider game tracking" })
  // @ApiBody({ type: GameTrackingDto })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "Ok",

  //   isArray: false,
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: "Bad Request",
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: "Unauthorized",
  // })
  // @ApiResponse({
  //   status: HttpStatus.INTERNAL_SERVER_ERROR,
  //   description: "Internal server error",
  // })
  // async create(
  //   @Body() GameTrackingDto: GameTrackingDto
  // ): Promise<GameTrackingDto> {
  //   return await this.GameTrackingService.create(GameTrackingDto);
  // }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any game-tracking, you can do so by providing the ID of that game-tracking along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({ type: ApiGameTrackingUpdateDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
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
  async update(
    @Body() GameTrackingDto: GameTrackingDto
  ): Promise<{ status: string; data?: GameTrackingDto; error?: string }> {
    return await this.GameTrackingService.update(GameTrackingDto,null,this.type);
  }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({
    description: "Please provide your game-tracking ID here to delete the corresponding game-tracking. If you've successfully created a game-tracking, you'll have received a game-tracking ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your game-tracking ID. Once the game-tracking is deleted, their information will be removed from the system.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: null,
    isArray: false,
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
  async deleteProvider(@Param("id") id): Promise<string> {
   return await this.GameTrackingService.delete(id,this.type);
  
  }
}
