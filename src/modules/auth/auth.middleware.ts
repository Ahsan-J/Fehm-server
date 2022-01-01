import { ForbiddenException, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { TokenService } from "src/helper-modules/token/token.service";
import { ApiService } from "../apikey/api.service";

@Injectable()
export class AuthAPIKeyMiddleware implements NestMiddleware {
    constructor(
        @Inject(TokenService)
        private tokenService: TokenService,
        private apiService: ApiService,
        ) {}
        
    async use(req: any, res: any, next: () => void) {
        if(!req.headers['x-api-key']) {
            throw new ForbiddenException("You Application is not authorized to use this API")
        }
        const key = req.headers['x-api-key'];
        await this.apiService.validateApiKeyAccess(key);
        next();
    }
}