import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): Observable<any> {
    let errorCode = status.INTERNAL;
    let message = 'Internal server error';
    let details = exception.message;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse() as any;
      
      message = response.message || exception.message;
      details = response.error || 'HTTP Exception';
      
      // Map HTTP status codes to gRPC status codes
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          errorCode = status.INVALID_ARGUMENT;
          break;
        case HttpStatus.UNAUTHORIZED:
          errorCode = status.UNAUTHENTICATED;
          break;
        case HttpStatus.FORBIDDEN:
          errorCode = status.PERMISSION_DENIED;
          break;
        case HttpStatus.NOT_FOUND:
          errorCode = status.NOT_FOUND;
          break;
        case HttpStatus.CONFLICT:
          errorCode = status.ALREADY_EXISTS;
          break;
        default:
          errorCode = status.INTERNAL;
      }
    } else if (exception instanceof RpcException) {
      const rpcError = exception.getError();
      message = typeof rpcError === 'string' ? rpcError : rpcError.message;
      details = 'RPC Exception';
      errorCode = status.INTERNAL;
    }

    this.logger.error(`[${errorCode}] ${message}`, {
      details,
      stack: exception.stack,
    });

    return throwError(() => ({
      code: errorCode,
      message: message,
      details: details,
    }));
  }
}
