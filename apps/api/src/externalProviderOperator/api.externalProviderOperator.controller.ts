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
  ApiHeader,
  ApiQuery,
  ApiBody,
  ApiSecurity,
} from "@nestjs/swagger";
import { ErrorResponse, Role } from "@app/shared/common/interfaces/errorResponse.interface";
import { externalProviderOpeartorDto } from "@app/shared/externalProviderOperator/externalProviderOperator.dto";
import { ExternalProviderOpeartorService } from '@app/shared/externalProviderOperator/externalProviderOperator.service';
import { CustomResponseService } from '@app/shared/core/custom-response/custom-response.service';
import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { checkDtoType } from "@app/shared/common/errorHandling";

@Controller("externalProviderOperator")
@ApiTags("External Provider Or Operator Apis")
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiexternalProviderOpeartorsController {
  private readonly type:string
  constructor(
    private externalProviderOpeartorService: ExternalProviderOpeartorService,
    private readonly customResponseService: CustomResponseService,
  ) {
    this.type='api'
   }

  @Version('1.0')
  @Get('/top10')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "Get top 10 external provider or operator" })
  @ApiQuery({
    name: "typeId",
    description: "Enter ProviderId or OperatorId Parameter",
    type: String
  })
  @ApiQuery({ name: "searchType", enum: Role,
  enumName: 'typeOptions', description: "type query parameter"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getTop10(@Query() params: {typeId: string,
   id: string, searchType: string 
}): Promise<externalProviderOpeartorDto[]> {
     if(params.searchType=="Provider"){
      params.searchType="Operator";
     }else{
      params.searchType="Provider";
     }
     params.id=params?.typeId
    return await this.externalProviderOpeartorService.getTop10(params,this.type);
  }

  // @Version("1.0")
  // @Get("/")
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @ApiOperation({ description: "To retrieve the list of external-provider-operator for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator)." })  @ApiQuery({
  //   name: "index",
  //   enum:Role,
  //   enumName:"index",
  //   description: "Choose any one",
  //   required: true,
  // })
  // // @ApiQuery({
  // //   name: "conmpanyName",
  // //   description: "conmpanyName parameter",
  // //   type: String,
  // //   required: false,
  // // })
  // @ApiQuery({
  //   name: "id",
  //   description: "id parameter",
  //   type: String,
  //   required: false,
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "Get all Data successfully",
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
  // async findAll(
  //   @Query() params: { index: string; companyName: string; id: string }
  // ): Promise<externalProviderOpeartorDto[]> {
  //   return await this.externalProviderOpeartorService.findAll(params,this.type);
  // }

  @Version("1.0")
  @Get("/search")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To search for any external-provider-operator, you'll need to send typeId, type, and query in the API request. typeId refers to the ID of that operator/provider (operatorId/providerId). type means their userRole, which can be Provider or Operator. query means whatever you want to search for. In the query, you can search data by name, ID, type, or email. In getUserDetails, the company ID will be your operatorId/providerId, and the type will be your userRole." })
  @ApiQuery({
    name: "limit",
    description: "limit Parameter",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "searchQuery",
    description: "Enter searchQuery like companyName ,companyEmail , id",
    type: String,
  })
  @ApiQuery({
    name:"index",
    enumName: "index",
    description: "searchType ",
    enum: Role,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get all Data successfully",
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
  async SearchByIdOrName(
    @Query()
    params: {
      authorId: string;
      offset: number;
      limit: number;
      idsToSkip: number[];
      searchQuery: string;
      searchType: string;
      index: string;
    }
  ): Promise<externalProviderOpeartorDto[]> {
    params.searchType=params.index;
    return await this.externalProviderOpeartorService.search(params);
  }

  @Version("1.0")
  @Get("/:id")
  @ApiOperation({ description: "Kindly input your external-provider-operator ID here to retrieve comprehensive external-provider-operator information. Upon successful external-provider-operator creation, you'll receive your external-provider-operator ID. Alternatively, you can utilize the 'get' APIs for external-provider-operator to obtain your external-provider-operator ID." })
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get Data successfully",
    type: externalProviderOpeartorDto,
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
  async findById(
    @Param("id") id: string
  ): Promise<externalProviderOpeartorDto> {
    return await this.externalProviderOpeartorService.getExternalProviderOperatorById(
      id,this.type
    );
  }

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new external-provider-operator, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>

<b>index</b>: Here, you should put your userRole (Provider or Operator) that you'll get from your getUser API.<br>
  `,
  })
  @ApiBody({ type: externalProviderOpeartorDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Created successfully",
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
    @Body() externalProviderOpeartorDto: externalProviderOpeartorDto
  ): Promise<externalProviderOpeartorDto> {
    checkDtoType(externalProviderOpeartorDto,"externalOP")
    return await this.externalProviderOpeartorService.createOne(
      externalProviderOpeartorDto,this.type
    );
  }

  // @Version("1.0")
  // @Post("/single_item")
  // @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  // @ApiOperation({ description: "Create single external provider or operator" })
  // @ApiBody({ type: externalProviderOpeartorDto })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: "Get all Data successfully",

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
  // async createOne(
  //   @Body() externalProviderOpeartorDto: externalProviderOpeartorDto
  // ): Promise<externalProviderOpeartorDto> {
  //   return await this.externalProviderOpeartorService.createOne(
  //     externalProviderOpeartorDto
  //   );
  // }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any external-provider-operator, you can do so by providing the ID of that external-provider-operator along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({ type: externalProviderOpeartorDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Updated successfully",
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
  async update(@Body() externalProviderOpeartorDto: externalProviderOpeartorDto): Promise<{ status: string, data?: externalProviderOpeartorDto, error?: string }> {
    return await this.externalProviderOpeartorService.update(externalProviderOpeartorDto,this.type);
  }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide your externalProviderOperator ID here to delete the corresponding externalProviderOperator. If you've successfully created a externalProviderOperator, you'll have received a externalProviderOperator ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your externalProviderOperator ID. Once the externalProviderOperator is deleted, their information will be removed from the system." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Deleted successfully",
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
    return await this.externalProviderOpeartorService.delete(id,this.type);
  }
}
