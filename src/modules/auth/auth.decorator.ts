import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from 'express';

export const AuthUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
   const { userId, apiKey } = ctx.switchToHttp().getRequest<Request>().auth;
   
});