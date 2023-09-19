import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { CustomResponseService } from './../../core/custom-response/custom-response.service';
import { CustomResponse, ErrCodes } from './../../core/custom-response/@types';

@Catch(QueryFailedError)
export class DBExceptionFilter implements ExceptionFilter {
  constructor(private readonly customResponseService: CustomResponseService) {}

  catch(exception: any, host: ArgumentsHost) {
    switch (exception.code) {
      case 'ER_DUP_ENTRY': {
        let message: string;
        if (exception.message.includes('email')) {
          message = 'email';
        }

        const res: CustomResponse<null> =
          this.customResponseService.buildErrorResponse(
            ErrCodes.BAD_PARAMETERS,
            message,
          );

        return res;
      }

      default: {
        const res: CustomResponse<null> =
          this.customResponseService.buildErrorResponse(
            ErrCodes.DATABASE_ERROR,
            'Unknown database error',
          );

        return res;
      }
    }
  }
}
