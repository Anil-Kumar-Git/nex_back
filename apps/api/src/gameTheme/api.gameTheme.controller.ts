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
  Patch,
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
  ApiQuery,
  ApiBody,
  ApiHeader,
  ApiSecurity,
} from "@nestjs/swagger";
import { ErrorResponse } from "@app/shared/common/interfaces/errorResponse.interface";

import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { GameThemesService } from "@app/shared/gameThemes/gameThemes.service";
import { GameThemesDto } from "@app/shared/gameThemes/gameThemes.dto";
import { checkDtoType } from "@app/shared/common/errorHandling";

@Controller("gameTheme")
@ApiTags("Game Themes Apis")
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiGameThemeController {
  private readonly type: string;

  constructor(
    private gameThemesService: GameThemesService,
    private readonly customResponseService: CustomResponseService
  ) {
    this.type = 'api';

  }

  @Version("1.0")
  @Get("/search")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "This API provides game themes. Here, you need to input the game theme's name in the search query, and you will receive data related to all the game themes associated with that particular theme." })
    @ApiQuery({
    name: "searchQuery",
    description: "searchQuery by gameTheme Parameter",
    type: String,
    required:true
  })
  // @ApiQuery({ name: "limit", description: "limit Parameter", type: Number, required:false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get game themes successfully",
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
  async SearchGamesThemes(
    @Query() param: { searchQuery: string; limit: number }
  ): Promise<GameThemesDto[]> {
    return await this.gameThemesService.SearchGamesThemes(param);
  }

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To retrieve the list of game-themes for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator)." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get game themes successfully",
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
  async getAll(): Promise<GameThemesDto[]> {
    return await this.gameThemesService.findAll();
  }

  @Version("1.0")
  @Get("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "Kindly input your game-theme ID here to retrieve comprehensive game-theme information. Upon successful game-theme creation, you'll receive your game-theme ID. Alternatively, you can utilize the 'get' APIs for game-theme to obtain your game-theme ID." })
  @ApiParam({ name: "id", type: String, required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get game theme successfully",
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
  async getById(@Param("id") id: string): Promise<GameThemesDto> {
    return await this.gameThemesService.findById(id,this.type);
  }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new game-theme, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error.`,
  })
  @ApiBody({ type: [GameThemesDto],description:'{example : {"data":[{"id": "123","gameTheme": "todo"}]}  Use the provided example to structure API data accordingly.'})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Game theme created successfully",
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
  async create(@Body() providerDto: GameThemesDto[]): Promise<GameThemesDto[]> {
    checkDtoType(providerDto,"gameTheme")
    return await this.gameThemesService.create(providerDto,this.type);
  }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any game-theme, you can do so by providing the ID of that game-theme along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({ type: GameThemesDto})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Game theme updated successfully",
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
  async update(@Body() providerDto: GameThemesDto): Promise<GameThemesDto> {
    return await this.gameThemesService.update(providerDto,this.type);
  }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide your game-theme ID here to delete the corresponding game-theme. If you've successfully created a game-theme, you'll have received a game-theme ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your game-theme ID. Once the game-theme is deleted, their information will be removed from the system." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Game theme deleted successfully",
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
  async deleteProvider(@Param("id") id: string): Promise<string> {
    return await this.gameThemesService.delete(id,this.type);
  }
}
