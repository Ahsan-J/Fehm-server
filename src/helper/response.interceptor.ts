import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface AppResponse<T> {
  message: string;
  data: T;
  statusCode: number;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, AppResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<AppResponse<T>> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>()
    return next.handle().pipe(map(data => { 
      return {
        data,
        message: res.statusMessage || "Success",
        statusCode: res.statusCode,
      }  
    }));
  }
}