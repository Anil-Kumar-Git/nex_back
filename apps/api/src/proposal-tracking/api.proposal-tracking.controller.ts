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
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiOperation,
  ApiQuery,
  ApiHeader,
  ApiBody,
  ApiSecurity

} from '@nestjs/swagger';
import { ErrorResponse, Role } from '@app/shared/common/interfaces/errorResponse.interface';


import { CustomResponseService } from '@app/shared/core/custom-response/custom-response.service';

import { ValidationExceptionFilter } from '@app/shared/common/exception-filters/validation-exception.filter';
import { DBExceptionFilter } from '@app/shared/common/exception-filters/db-exception.filter';
import { query } from 'express';
import { ProposalTrackingService } from '@app/shared/proposalTracking/proposal_tracking.service';
import { ProposalTrackingDto } from '@app/shared/proposalTracking/proposal_tracking.dto';


@Controller('proposalTracking')
@ApiTags('Proposal Tracking Apis')
@ApiSecurity('Api-Key')
@ApiSecurity('basic')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiProposalTrackingController {
  private readonly type:string;
  constructor(
    private proposalTrackingService: ProposalTrackingService,
    private readonly customResponseService: CustomResponseService,
  ) { 
    this.type='api'
  }

  @Version('1.0')
  @Get('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "To retrieve the list of proposal-tracking for any provider/operator, you'll need to send the providerId/operatorId and index. In the getUserDetails, the company ID will be your providerId/operatorId, and the userRole will be your index (Provider or Operator)." })
  // @ApiQuery({
  //   name: "id",
  //   description: "id of Proposal-tracking Parameter",
  //   type: String,
  //   required: false,
  // })
  @ApiQuery({
    name: "createdBy",
    description: "createdBy id (who created this proposal)",
    type: String,
    required: true,
  })
  // @ApiQuery({
  //   name: "index",
  //   enum:Role,
  //   enumName:"index",
  //   description: "Choose any one",
  //   required: true,
  // })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get all Proposal tracking successfully",
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
  async findAll(@Query() params: {id:string,index:string,createdBy:string,proposalId?:string} ): Promise<{status: string, data?: ProposalTrackingDto[], error?: string }> {
     return await this.proposalTrackingService.getProposalTrackingByDetails(params,this.type);
  }


  @Version('1.0')
  @Get('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({ description: "Kindly input your proposal-tracking ID here to retrieve comprehensive proposal-tracking information. Upon successful proposal-tracking creation, you'll receive your proposal-tracking ID. Alternatively, you can utilize the 'get' APIs for proposal-tracking to obtain your proposal-tracking ID." })
  @ApiParam({ name: "id", type: String, required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get proposal-tracking successfully",
    
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
  async findById(@Param('id') id: string): Promise<ProposalTrackingDto> {
     return await this.proposalTrackingService.getProposalTrackingById(id,this.type);
  }


  @Version('1.0')
  @Post('/providerProposal')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new provider-proposal, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>

<b>index</b>: Here, you should put your userRole (Provider or Operator) that you'll get from your getUser API.<br>
<b>senderId</b>: Here, the companyId of the user sending this proposal will be provided. You can obtain the companyId from your own getUser API.<br>
<b>receiverId</b>:  In this field, you should include the companyId of those users with whom you intend to share this proposal. This field can accommodate multiple companyIds<br>
<b>proposalId</b>: You should enter the ID of the proposal that you wish to share with any other user here.
<br><b>createdBy</b>:In this field, you should input your user ID, which you will receive when you create a user.<br>`,
  })
  @ApiBody({type:ProposalTrackingDto})
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
    description: 'Unauthorized'
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async create(@Body() proposalTrackingDto: ProposalTrackingDto): Promise<{ status: string, data?: ProposalTrackingDto[], error?: string }> {
      return await this.proposalTrackingService.create(proposalTrackingDto,this.type);
  }

  @Version('1.0')
  @Post('/operatorProposal')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @ApiOperation({
    description: `To create a new operator-proposal, you need to follow the example provided in the request body below. Ensure that the data types of all values match exactly with what's given in the example; otherwise, the API will return an error. There are some values that will be based on this format:<br>

<b>index</b>: Here, you should put your userRole (Provider or Operator) that you'll get from your getUser API.<br>
<b>senderId</b>: Here, the companyId of the user sending this proposal will be provided. You can obtain the companyId from your own getUser API.<br>
<b>receiverId</b>:  In this field, you should include the companyId of those users with whom you intend to share this proposal. This field can accommodate multiple companyIds<br>
<b>proposalId</b>: You should enter the ID of the proposal that you wish to share with any other user here.
<br><b>createdBy</b>:In this field, you should input your user ID, which you will receive when you create a user.<br>`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: ProposalTrackingDto,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: ErrorResponse,
  })
  async createOperatorProposalTracking(@Body() proposalTrackingDto: ProposalTrackingDto): Promise<{ status: string, data?: ProposalTrackingDto[], error?: string }> {
    return await this.proposalTrackingService.createOperatorProposalTracking(proposalTrackingDto);
  }

  @Version('1.0')
  @Put('/')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      "If you want to update the details of any proposal-tracking, you can do so by providing the ID of that proposal-tracking along with the updated details in the request body and then execute it. If an error occurs, this API will return an error.",
  })
  @ApiBody({type:ProposalTrackingDto})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Proposal-tracking updated successfully",
    
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
  async update(@Body() proposalTrackingDto: ProposalTrackingDto): Promise<{ status: string; data?: ProposalTrackingDto; error?: string }> {
    return await this.proposalTrackingService.update(proposalTrackingDto,this.type);
   }

  @Version('1.0')
  @Delete('/:id')
  @UseFilters(ValidationExceptionFilter, DBExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: "id", type: String, required: true })
  @ApiOperation({ description: "Please provide your proposal-tracking ID here to delete the corresponding proposal-tracking. If you've successfully created a proposal-tracking, you'll have received a proposal-tracking ID. Alternatively, you can use the 'get' APIs for providers or operators to acquire your proposal-tracking ID. Once the proposal-tracking is deleted, their information will be removed from the system." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Proposal-tracking deleted successfully",
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
  async deleteProvider(@Param('id') id:string): Promise<string> {
    return await this.proposalTrackingService.delete(id,this.type);
   return null
  }

}
