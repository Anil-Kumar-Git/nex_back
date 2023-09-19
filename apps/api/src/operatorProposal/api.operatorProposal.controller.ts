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
  ApiBody,
  ApiHeader,
  ApiSecurity,
} from "@nestjs/swagger";
import { ContractDtoDefault, ErrorResponse, OperatorDefaultDto } from "@app/shared/common/interfaces/errorResponse.interface";

import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { OperatorProposalService } from "@app/shared/operatorProposal/operatorProposal.service";
import { OperatorProposalDto } from "@app/shared/operatorProposal/operatorProposal.dto";
import { query } from "express";
import { apiOperatorEditProposalDto } from "@app/shared/common/apiDtos";
import { checkDtoType } from "@app/shared/common/errorHandling";

@Controller("operatorProposal")
@ApiTags("Operator Proposal Apis")
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiOperatorProposalController {
  private readonly type:string; 
  constructor(
    private OperatorProposalService: OperatorProposalService,
    private readonly customResponseService: CustomResponseService
  ) { 
    this.type="api"
  }

  @Version("1.0")
  @Get("/search")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To search for any operator-proposal, you'll need to send typeId, type, and query in the API request. typeId refers to the ID of that operator/provider (operatorId/providerId). type means their userRole, which can be Provider or Operator. query means whatever you want to search for. In the query, you can search data by name, ID, type, or email. In getUserDetails, the company ID will be your operatorId/providerId, and the type will be your userRole." })
  @ApiQuery({
    name: "typeId",
    description: "typeId as a ProviderId or OpraterId Parameter",
    type: String,
  })
  // @ApiQuery({
  //   name: "type",
  //   description: "type Provider or Oprater Parameter",
  //   type: String,
  // })
  @ApiQuery({
    name: "query",
    description: "query as (proposalId ,proposalName ) Parameter",
    type: String,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Operator proposal get successfully",

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
  async filterProposal(
    @Query() params: { query?: string; typeId?: string; }
  ): Promise<OperatorProposalDto[]> {
    return await this.OperatorProposalService.searchDetails(params,this.type);
  }

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To retrieve the list of operator-proposal for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator)." })
  @ApiQuery({
    name: "operatorId",
    description: "operatorId Parameter",
    type: String,
  })
  @ApiQuery({
    name: "id",
    description: "Operator proposal id Parameter",
    type: String,
    required: false
  })
  @ApiQuery({
    name: "createdBy",
    description: "Id of user who created this Operator",
    type: String,
    required: false
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Operator proposal get successfully",

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
    @Query() params: { operatorId: string; id: string; createdBy: string }
  ): Promise<OperatorProposalDto[]> {
    return await this.OperatorProposalService.find(params,this.type);
  }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new operator-proposal, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>
<b>operatorId</b>: If you're an Operator, you need to put your company ID here, which you'll get from the getUser API. If you're not an Operator, you can obtain the operatorId from the get API of proposal-tracking.
<br><b>createdBy</b>:In this field, you should input your user ID, which you will receive when you create a user.`})
  @ApiBody({ type: OperatorProposalDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Operator proposal created successfully",

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
  async create(
    @Body() OperatorProposalDto: OperatorProposalDto
  ): Promise<{ status: string, data?: OperatorProposalDto, error?: string }> {
    checkDtoType(OperatorProposalDto,"OProposal")
    return await this.OperatorProposalService.create(OperatorProposalDto,this.type);
  }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any operator-proposal, you can do so by providing the ID of that operator-proposal along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({ type: apiOperatorEditProposalDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Operator Proposal updated successfully",

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
  async update(
    @Body() OperatorProposalDto: OperatorProposalDto
  ): Promise<{ status: string, data?: OperatorProposalDto, error?: string }> {
    return await this.OperatorProposalService.update(OperatorProposalDto,this.type);
  }

  // @Version("1.0")
  // @Put("/UpdateDefault")
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   description:
  //     `If you wish to set any operator-proposal as the default, you should send the operator-proposal ID and set "default" to true in the request body. The format for "default" should always be a boolean.`,
  // })
  // @ApiBody({ type: OperatorDefaultDto })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "Update default operator Proposal successfully",

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
  // async UpdateDefault(
  //   @Body()
  //   operatorProposalDto: {
  //     id: string;
  //     operatorId: string;
  //     default: boolean;
  //   }
  // ): Promise<{ status: string, data?: OperatorProposalDto, error?: string }> {
  //   return await this.OperatorProposalService.UpdateDefault(
  //     operatorProposalDto,this.type
  //   );
  // }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide your operator-propsal ID here to delete the corresponding operator-propsal. If you've successfully created a operator-propsal, you'll have received a operator-propsal ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your operator-propsal ID. Once the operator-propsal is deleted, their information will be removed from the system." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Operator proposal deleted successfully",
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
    return await this.OperatorProposalService.delete(id,this.type);
  }
}
