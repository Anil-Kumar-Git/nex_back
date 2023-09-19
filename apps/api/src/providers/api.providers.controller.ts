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
  ApiHeader,
  ApiSecurity,
} from "@nestjs/swagger";
import { ProvidersService } from "@app/shared/providers/providers.service";
import { ProvidersDto } from "@app/shared/providers/providers.dto";

import { CustomResponseService } from "@app/shared/core/custom-response/custom-response.service";

import { ValidationExceptionFilter } from "@app/shared/common/exception-filters/validation-exception.filter";
import { DBExceptionFilter } from "@app/shared/common/exception-filters/db-exception.filter";
import { ProvidersUpdateDto } from "@app/shared/providers/providers_update.dto";
import { checkDtoType } from "@app/shared/common/errorHandling";

@Controller("providers")
@ApiTags("Providers Apis")
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiProvidersController {
  private readonly type:string; 
  constructor(
    private providersService: ProvidersService,
    private readonly customResponseService: CustomResponseService
  ) {this.type="api"}

  @Version("1.0")
  @Post("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new providers, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:
    <br><b>memberId</b>:When you purchase a plan from Nexus, you will receive your member ID. Please use it here.<br>
    <b>createdBy</b>:In this field, you should input your user ID, which you will receive when you create a user.<br>`  })
  @ApiBody({ type: ProvidersDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider created successfully",
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
  async create(@Body() providerDto: ProvidersDto): Promise<ProvidersDto> {
    providerDto.planDetails=JSON.stringify(providerDto.planDetails);
    checkDtoType(providerDto,"provider")
    return await this.providersService.create(providerDto,this.type);
  }

  @Version("1.0")
  @Put("/")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any provider, you can do so by providing the ID of that provider along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({ type: ProvidersUpdateDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider updated successfully",
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
  async update(@Body() providerDto: ProvidersDto): Promise<{status:string,data?:ProvidersDto,error?:string}> {
    return await this.providersService.update(providerDto,this.type);
  }

  @Version("1.0")
  @Delete("/:id")
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide your provider ID here to delete the corresponding provider. If you've successfully created a provider, you'll have received a provider ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your provider ID. Once the provider is deleted, their information will be removed from the system." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Provider deleted successfully",
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
    return await this.providersService.delete(id,this.type);
  }
}
