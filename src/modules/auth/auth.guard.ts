import { Injectable, CanActivate, ExecutionContext, Inject, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { UserRole } from '../user/user.enum';

export const UseRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(@Inject(AuthService) private authService: AuthService, private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [context.getHandler(), context.getClass()]) || [];
        const request = context.switchToHttp().getRequest<Request>();
        
        // @Todo: Remove Dev key
        if(request.headers.authorization.includes("Z21BYkxwNmhPbkdkUkRsQTBCYkI4fFNwaURldlh8V2w4dzlvN3R6OXotdXRjYVMyOUlRfDEyM3x8fDIwMjEtMTItMDVUMjE6NTA6MjQuNzM1Wg==")) {
            request.auth = this.authService.getTokenData(request.headers);
            return true
        }
        
        if(requiredRoles.includes(UserRole.SuperAdmin)) {
            return true // Super Admin Validation
        }

        if(requiredRoles.includes(UserRole.Admin)) {
            return true // Admin Validation
        }

        if(requiredRoles.includes(UserRole.Narrator)) {
            return true // Validation in case user is Narrator
        }
        
        try {

            if(this.authService.validateAccessToken(request.headers)) {
                request.auth = this.authService.getTokenData(request.headers);
                return true; 
            } else {
                return false
            }

        } catch(e) {
            return false;
        }
    }
}