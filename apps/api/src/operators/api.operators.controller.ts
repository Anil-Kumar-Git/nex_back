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
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiProduces,
  ApiConsumes,
  ApiOperation,
  ApiExcludeEndpoint,
  ApiProperty,
  ApiParam,
  ApiHeader,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { ErrorResponse } from '@app/shared/common/interfaces/errorResponse.interface';

import { OperatorsService } from '@app/shared/operators/operators.service';
import { OperatorsDto } from '@app/shared/operators/operators.dto';
import { Operators } from '@app/shared/operators/operators.entity';

import { CustomResponseService } from '@app/shared/core/custom-response/custom-response.service';

import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';
import { checkDtoType } from '@app/shared/common/errorHandling';

@Controller('operators')
@ApiTags('Operator Apis')
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)

export class ApiOperatorsController {
  private readonly type:string;
  constructor(
    private operatorsService: OperatorsService,
    private readonly customResponseService: CustomResponseService,
  ) { this.type="api"}

  @Version('1.0')
  @Post('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new operators, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>

<b>memberId</b>:When you purchase a plan from Nexus, you will receive your member ID. Please use it here.<br>
<b>createdBy</b>:In this field, you should input your user ID, which you will receive when you create a user.<br>`
 })
  @ApiBody({type:OperatorsDto})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Operator created successfully",
    
    isArray: false,
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
  async create(@Body() operatorDto: OperatorsDto): Promise<OperatorsDto> {
   
    operatorDto.planDetails=JSON.stringify(operatorDto.planDetails);

    checkDtoType(operatorDto,"opeator")
    return await this.operatorsService.create(operatorDto,this.type);
  }

  @Version('1.0')
  @Put('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any operator, you can do so by providing the ID of that operator along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({type:OperatorsDto})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Operator updated successfully",
    
    isArray: false,
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
  async update(@Body() operatorDto: OperatorsDto): Promise<{ status: string, data?: OperatorsDto, error?: string }> {
    return await this.operatorsService.update(operatorDto,this.type);
  }

  @Version('1.0')
  @Delete('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide your operator ID here to delete the corresponding operator. If you've successfully created a operator, you'll have received a operator ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your operator ID. Once the operator is deleted, their information will be removed from the system." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Operator deleted successfully",
    type: null,
    isArray: false,
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
  async deleteOperator(@Param('id') id:string): Promise<string> {
    return await this.operatorsService.delete(id,this.type);
  }
}
