import { Injectable, CanActivate, ExecutionContext, Inject, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenService } from 'src/helper-modules/token/token.service';
import { APIAccessLevel } from '../apikey/api.enum';
import { UserRole } from '../user/user.enum';

export const UseRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);
export const UseAccess = (...access: APIAccessLevel[]) => SetMetadata('access', access);

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(TokenService) 
        private tokenService: TokenService, 
        private reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [context.getHandler(), context.getClass()]) || [];
        const apiAccess = this.reflector.getAllAndOverride<UserRole[]>('access', [context.getHandler(), context.getClass()]) || [];
        const request = context.switchToHttp().getRequest<Request>();
        
        // @Todo: Remove Dev key
        if(request.headers.authorization?.includes("dev-token")) return true
        
        try {
            if(await this.tokenService.validateAccessToken(request.headers)) {
                const auth = this.tokenService.getTokenData(request.headers);
                if(!apiAccess.includes(auth.apiAccess)) return false;
                if(!requiredRoles.includes(auth.userRole)) return false;
                return true; 
            }
        } catch(e) {
            console.log(e);
        }
        
        return false
    }
}