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
} from "@nestjs/swagger";
import { ErrorResponse } from "@app/shared/common/interfaces/errorResponse.interface";

import { ScrapperGamesService } from "@app/shared/scrapperGames/scrapper_games.service";

import { CustomResponseService } from "@app/shared//core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared//common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";

import { BasicAuthGuard } from "@app/shared/basicauth/basic.auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { ScrapperGamesDto } from "@app/shared/scrapperGames/scrapper_games.dto";

@Controller("scrappergames")
@ApiTags("games")
export class WebScrapperGamesController {
  constructor(
    private gamesService: ScrapperGamesService,
    private readonly customResponseService: CustomResponseService
  ) {}

  @Version("1.0")
  @Get("/search")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "search the list of scrapper games" })
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
    @Query() params: { query?: string; typeId?: string; type: string }
  ): Promise<ScrapperGamesDto[]> {
    return await this.gamesService.searchDetails(params);
  }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "create a scrapper game" })
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
  async create(
    @Body() gameDto:{data:ScrapperGamesDto[]} 
  ): Promise<{ status: string; data?: ScrapperGamesDto[]; error?: string }> {
    
    return await this.gamesService.create(gameDto?.data);
  }


  @Version("1.0")
  @Post("/createScrapper")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "create a scrapper game" })
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
  async createScrapper(
    @Body() gameDto:{data:ScrapperGamesDto[]} 
  ): Promise<{ status: string; data?: ScrapperGamesDto[]; error?: string }> {
    
    return await this.gamesService.createScrapper(gameDto?.data);
  }
  @Version("1.0")
  @Post("/single")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "create a scrapper game" })
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
  async createOne(
    @Body() gameDto: ScrapperGamesDto
  ): Promise<{ status: string; data?: ScrapperGamesDto; error?: string }> {
    return await this.gamesService.createOne(gameDto);
  }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "update game" })
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
  async update(
    @Body() gameDto: ScrapperGamesDto
  ): Promise<{ status: string; data?: ScrapperGamesDto; error?: string }> {
    return await this.gamesService.update(gameDto);
  }

  @Version("1.0")
  @Get("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id" })
  @ApiOperation({ description: "get game by game id" })
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
    return await this.gamesService.getGameById(id);
  }

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "get all list of the games ,or you can also pass param for fetch particular game using game id ,created by,procider id and much moe",
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
    return await this.gamesService.findAll(query);
  }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id" })
  @ApiOperation({ description: "delete game" })
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
    return await this.gamesService.delete(id);
  }

  @Version("1.0")
  @Post("/image")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const imageURL = `https://backend-web-staging-nexus-ajgx2w.mo1.mogenius.io/${file.path}`;
 
    return {
      message: "image uploaded",
      path: imageURL,
    };
  }
}
