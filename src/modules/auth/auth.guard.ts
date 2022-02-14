import { Injectable, CanActivate, ExecutionContext, Inject, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CommonService } from 'src/helper-modules/common/common.service';
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
        @Inject(CommonService)
        private commonService: CommonService,
        private reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [context.getHandler(), context.getClass()]) || [];
        const apiAccess = this.reflector.getAllAndOverride<APIAccessLevel[]>('access', [context.getHandler(), context.getClass()]) || [];
        const request = context.switchToHttp().getRequest<Request>();
        if(await this.tokenService.validateAccessToken(request.headers)) {
            const auth = this.tokenService.getTokenData(request.headers);
            if(apiAccess.length && !apiAccess.some(access => this.commonService.checkValue(auth.apiAccess, access))) return false;
            if(requiredRoles.length && !requiredRoles.some(role => this.commonService.checkValue(auth.userRole, role))) return false;
            return true; 
        }
        
        return false
    }
}