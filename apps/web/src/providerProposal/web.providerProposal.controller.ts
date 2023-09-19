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
} from "@nestjs/common";
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";
import { ErrorResponse } from "@app/shared/common/interfaces/errorResponse.interface";

import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { ProviderProposalService } from "@app/shared/providerProposal/providerProposal.service";
import { providerProposalDto } from "@app/shared/providerProposal/providerProposal.dto";

@Controller("providerProposal")
@ApiTags("providerProposal")
@UseInterceptors(ClassSerializerInterceptor)
export class WebProviderProposalController {
  constructor(
    private ProviderProposalService: ProviderProposalService,
    private readonly customResponseService: CustomResponseService
  ) {}

  @Version("1.0")
  @Get("/search")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: "get provider proposal by id ,providerID and createdBy",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: providerProposalDto,
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
  async filterProposal(
    @Query() params: { query?: string; typeId?: string; type: string }
  ): Promise<providerProposalDto[]> {
    return await this.ProviderProposalService.searchDetails(params);
  }

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: "get provider proposal by id ,providerID and createdBy",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: providerProposalDto,
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
  async findAll(
    @Query() params: { providerId: string; id: string; createdBy: string }
  ): Promise<providerProposalDto[]> {
    
    return await this.ProviderProposalService.find(params);
  }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "create provider proposal" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: providerProposalDto,
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
    @Body() providerProposalDto: providerProposalDto
  ): Promise<{status:string,data?:providerProposalDto,error?:string}> {
    return await this.ProviderProposalService.create(providerProposalDto);
  }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "update providerProposal by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: providerProposalDto,
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
    @Body() providerProposalDto: providerProposalDto
  ): Promise<{status:string,data?:providerProposalDto,error?:string}> {
    return await this.ProviderProposalService.update(providerProposalDto);
  }

  @Version("1.0")
  @Put("/UpdateDefault")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "update providerProposal by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Ok",
    type: providerProposalDto,
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
  async UpdateDefault(
    @Body()
    providerProposalDto: {
      id: string;
      providerId: string;
      default: boolean;
    }
  ): Promise<{status:string,data?:providerProposalDto,error?:string}> {
    return await this.ProviderProposalService.UpdateDefault(
      providerProposalDto
    );
  }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id" })
  @ApiOperation({ description: "delete provider proposal by id" })
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
  async deleteProvider(@Param("id") id): Promise<string> {
    return await this.ProviderProposalService.delete(id);
  }
}
