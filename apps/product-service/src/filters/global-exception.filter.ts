import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status, StatusObject } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';

interface GrpcErrorResponse {
  code: status;
  message: string;
  details: string;
}

interface RpcError {
  message?: string;
  details?: string;
  code?: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): Observable<GrpcErrorResponse> {
    let errorCode: status = status.INTERNAL;
    let message = 'Internal server error';
    let details = exception.message;

    if (exception instanceof HttpException) {
      const httpStatus = exception.getStatus();
      const response = exception.getResponse() as any;
      
      message = response.message || exception.message;
      details = response.error || 'HTTP Exception';
      
      switch (httpStatus) {
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
        case HttpStatus.UNPROCESSABLE_ENTITY:
          errorCode = status.FAILED_PRECONDITION;
          break;
        case HttpStatus.TOO_MANY_REQUESTS:
          errorCode = status.RESOURCE_EXHAUSTED;
          break;
        case HttpStatus.SERVICE_UNAVAILABLE:
          errorCode = status.UNAVAILABLE;
          break;
        default:
          errorCode = status.INTERNAL;
      }
    } else if (exception instanceof RpcException) {
      const rpcError = exception.getError() as string | RpcError;
      if (typeof rpcError === 'string') {
        message = rpcError;
        details = 'RPC Exception';
      } else {
        message = rpcError.message || 'RPC Exception';
        details = rpcError.details || 'Unknown RPC Error';
        if (rpcError.code) {
          errorCode = rpcError.code as status;
        }
      }
    }

    this.logger.error(`[${errorCode}] ${message}`, {
      details,
      stack: exception.stack,
      timestamp: new Date().toISOString(),
      service: 'product-service'
    });

    return throwError(() => ({
      code: errorCode,
      message,
      details,
    }));
  }
}
