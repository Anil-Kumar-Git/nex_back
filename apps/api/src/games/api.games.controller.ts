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
  ApiBody,
  ApiQuery,
  ApiHeader,
  ApiSecurity,
} from "@nestjs/swagger";
import { ErrorResponse, Role, apiUpdateGamesDto } from "@app/shared/common/interfaces/errorResponse.interface";

import { GamesService } from "@app/shared/games/games.service";
import { GamesDto } from "@app/shared/games/games.dto";
import { Games } from "@app/shared/games/games.entity";

import { ValidateService } from "@app/shared//core/config/validate.service";

import { CustomResponseService } from "@app/shared//core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared//common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";

import { BasicAuthGuard } from "@app/shared/basicauth/basic.auth.guard";
import { checkDtoType } from "@app/shared/common/errorHandling";

@Controller("games")
@ApiTags("Game Apis")
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
export class ApiGamesController {
  private readonly type:string; 
  constructor(
    private gamesService: GamesService,
    private readonly customResponseService: CustomResponseService
  ) {this.type="api"}

  @Version("1.0")
  @Get("/search")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "To search for any games, you'll need to send typeId, type, and query in the API request. typeId refers to the ID of that operator/provider (operatorId/providerId). type means their userRole, which can be Provider or Operator. query means whatever you want to search for. In the query, you can search data by name, ID, type, or email. In getUserDetails, the company ID will be your operatorId/providerId, and the type will be your userRole." })
    @ApiQuery({
    name: "query",
    description: "query (id ,gameName ,revShareTiedToGameType) parameter",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "typeId",
    description: "typeId (providerId Or operatorId) query parameter",
    type: String,
  })
  // @ApiQuery({ name: "type", enum: Role,
  // enumName: 'typeOptions', description: "type query parameter"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: GamesDto,
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
    @Query() params: { query?: string; typeId?: string; type: string }
  ): Promise<GamesDto[]> {
    return await this.gamesService.searchDetails(params,this.type);
  }


  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new game, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>

<b>providerId</b>: If you're a Provider, you need to put your company ID here, which you'll get from the getUser API. If you're not a Provider, you can obtain the providerId from the get API of proposal-tracking.
<br><b>createdBy</b>:In this field, you should input your user ID, which you will receive when you create a user.<br>
<b>gameTheme</b>:In this field, you should input game theme, which you will receive from get game theme api.<br>..`  })
    @ApiBody({ type: GamesDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Game created successfully",
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
    type: ErrorResponse,
  })
  async create(@Body() gameDto: GamesDto): Promise<{ status: string, data?: GamesDto, error?: string }> {
    checkDtoType(gameDto,"games")
    return await this.gamesService.create(gameDto,this.type);
  }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any game, you can do so by providing the ID of that game along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({ type: apiUpdateGamesDto ,description:`These are some parameter values below which you will include in your request. No other values will be accepted apart from these :<br><br>
  <b>technology</b> = "HTML5" , "Flash" , "Javascript/WebGL"<br>
  <b>platforms</b> = "Mobile" , "Desktop" , "Native App" , "Download" <br>
  <b>volatility</b> = "Low" , "Medium" , "High";`})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Game updated successfully",
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
    type: ErrorResponse,
  })
  async update(@Body() gameDto: GamesDto): Promise<{ status: string, data?: GamesDto, error?: string }> {
    checkDtoType(gameDto,"games")
    return await this.gamesService.update(gameDto,this.type);
  }

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "To retrieve the list of games for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator)." })
  @ApiQuery({
    name: "createdBy",
    description: "createdBy id Parameter <br> <b>Note :</b> If you send the 'createdBy' ID, only the games related to both the 'providerId' and the 'createdBy' ID will be retrieved.",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "providerId",
    description: "Provider Id Parameter",
    type: String,
  })
  @ApiQuery({
    name: "sortBy",
    description: "Short by (id ,gameName,gameType,createdDate ) Parameter",
    type: String,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get all games successfully",
    isArray: true,
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
    type: ErrorResponse,
  })
  async findAll(
    @Query() query: { createdBy: string; providerId: string; sortBy: string ,shortBy:string}
  ): Promise<GamesDto[]> {
   query.shortBy=query.sortBy;
    return await this.gamesService.findAll(query,this.type);
  }

  @Version("1.0")
  @Get("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Kindly input your game ID here to retrieve comprehensive game information. Upon successful game creation, you'll receive your game ID. Alternatively, you can utilize the 'get' APIs for game to obtain your game ID." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get single game successfully",
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
    type: ErrorResponse,
  })
  async getGame(@Param('id') id): Promise<GamesDto> {
    return await this.gamesService.getGameById(id,this.type);
  }
  // async getGame(@Param("id") id): Promise<GamesDto> {
  //   return await this.gamesService.getGame(id);
  // }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide your game ID here to delete the corresponding game. If you've successfully created a game, you'll have received a game ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your game ID. Once the game is deleted, their information will be removed from the system." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Deleted game successfully",
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
    type: ErrorResponse,
  })
  async deleteGame(@Param("id") id): Promise<string> {
    return await this.gamesService.delete(id,this.type);
  }
}
