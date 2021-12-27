import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { AuthService } from "./modules/auth/auth.service";
import { UsersService } from "./modules/user/user.service";

@Injectable()
export class AuthUserMiddleware implements NestMiddleware{
    constructor(
        private userService: UsersService,
        private authService: AuthService,
        ) {}
        
    async use(req: any, res: any, next: () => void) {
        try {
            const { userId } = this.authService.getTokenData(req.headers)
            if(!req.session.user && req.headers?.authorization) {
                req.session.user = await this.userService.getUser(userId)
            }
            if(req.session.user?.id != userId) {
                throw new ForbiddenException("Token mismatch with user") ;
            }
        } catch (e) {
            throw new ForbiddenException("Token mismatch with user")
        }

        next();
    }
}