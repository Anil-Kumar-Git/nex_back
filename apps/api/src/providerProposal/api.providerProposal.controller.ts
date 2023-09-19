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
  ApiHeader,
  ApiBody,
  ApiSecurity,
} from "@nestjs/swagger";
import { ContractDtoDefault, ErrorResponse } from "@app/shared/common/interfaces/errorResponse.interface";

import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { ProviderProposalService } from "@app/shared/providerProposal/providerProposal.service";
import { providerProposalDto } from "@app/shared/providerProposal/providerProposal.dto";
import { checkDtoType } from "@app/shared/common/errorHandling";

@Controller("providerProposal")
@ApiTags("Provider Proposal Apis")
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiProviderProposalController {
  private readonly type:string;
  constructor(
    private ProviderProposalService: ProviderProposalService,
    private readonly customResponseService: CustomResponseService
  ) {
    this.type="api"
  }

  @Version("1.0")
  @Get("/search")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To search for any provider-proposal, you'll need to send typeId, type, and query in the API request. typeId refers to the ID of that operator/provider (operatorId/providerId). type means their userRole, which can be Provider or Operator. query means whatever you want to search for. In the query, you can search data by name, ID, type, or email. In getUserDetails, the company ID will be your operatorId/providerId, and the type will be your userRole." })
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
    description: "query as (id ,proposalName ) Parameter",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider proposal get successfully",
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
    @Query() params: { query?: string; typeId?: string; type: string }
  ): Promise<providerProposalDto[]> {
    return await this.ProviderProposalService.searchDetails(params);
  }

  @Version("1.0")
  @Get("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To retrieve the list of provider-proposals for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator)." })
  @ApiQuery({
    name: "providerId",
    description: "Provider id Parameter",
    type: String,
  })
  @ApiQuery({
    name: "id",
    description: "Provider proposal id Parameter",
    type: String,
    required:false
  })
  // @ApiQuery({
  //   name: "createdBy",
  //   description: "createdBy id (whos user created this ) Parameter",
  //   type: String,
  //   required: false,
  // })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider proposals get successfully",
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
    @Query() params: { providerId: string; id: string; createdBy: string }
  ): Promise<providerProposalDto[]> {
    return await this.ProviderProposalService.find(params,this.type);
  }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new provider-proposal, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>

<b>providerId</b>: If you're a Provider, you need to put your company ID here, which you'll get from the getUser API. If you're not a Provider, you can obtain the providerId from the get API of proposal-tracking.<br>
<b>createdBy</b>:In this field, you should input your user ID, which you will receive when you create a user.<br>`,
  })
  @ApiBody({ type: providerProposalDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider proposal created successfully",

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
    @Body() providerProposalDto: providerProposalDto
  ): Promise<{status:string,data?:providerProposalDto,error?:string}> {
    checkDtoType(providerProposalDto,"PProposal")
    return await this.ProviderProposalService.create(providerProposalDto,this.type);
  }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any provider-proposal, you can do so by providing the ID of that provider-proposal along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({ type: providerProposalDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider proposal updated successfully",
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
    @Body() providerProposalDto: providerProposalDto
  ): Promise<{status:string,data?:providerProposalDto,error?:string}> {
    return await this.ProviderProposalService.update(providerProposalDto,this.type);
  }

  // @Version("1.0")
  // @Put("/UpdateDefault")
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   description:
  //     `If you wish to set any provider-proposal as the default, you should send the provider-proposal ID and set "default" to true in the request body. The format for "default" should always be a boolean.`,
  // })
  // @ApiBody({ type: ContractDtoDefault })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "Provider proposal set default successfully",
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
  //   providerProposalDto: {
  //     id: string;
  //     providerId: string;
  //     default: boolean;
  //   }
  // ): Promise<{status:string,data?:providerProposalDto,error?:string}> {
  //   return await this.ProviderProposalService.UpdateDefault(
  //     providerProposalDto,this.type
  //   );
  // }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide your provider-proposal ID here to delete the corresponding provider-proposal. If you've successfully created a provider-proposal, you'll have received a provider-proposal ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your provider-proposal ID. Once the provider-proposal is deleted, their information will be removed from the system." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider proposal deleted successfully",
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
    return await this.ProviderProposalService.delete(id,this.type);
  }
}
