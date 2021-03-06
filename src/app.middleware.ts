import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { TokenService } from "./helper-modules/token/token.service";
import { UsersService } from "./modules/user/user.service";

@Injectable()
export class InjectSessionUser implements NestMiddleware{
    constructor(
        private userService: UsersService,
        private tokenService: TokenService,
        ) {}
        
    async use(req: any, res: any, next: () => void) {
        try {
            // if(!req.headers?.authorization) {
            //     return next();
            // }
            const { userId } = this.tokenService.getTokenData(req.headers)
            if(!req.session.user) {
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