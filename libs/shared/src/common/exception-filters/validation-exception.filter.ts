import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';

import { CustomResponseService } from './../../core/custom-response/custom-response.service';
import { CustomResponse, ErrCodes } from './../../core/custom-response/@types';

@Catch(BadRequestException)
export class ValidationExceptionFilter
  implements ExceptionFilter<BadRequestException>
{
  constructor(private readonly customResponseService: CustomResponseService) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    let constraints: string[] | string;

    if (typeof exception.getResponse() === 'object') {
      let err: any = exception.getResponse();
      if (err.message && Array.isArray(err.message)) constraints = err.message;
    } else {
      constraints = exception.getResponse() as string;
    }

    const err: CustomResponse<null> =
      this.customResponseService.buildErrorResponse(
        ErrCodes.BAD_PARAMETERS,
        constraints,
      );

    return err;
  }
}
